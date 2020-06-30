using System;
using System.Collections.Specialized;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Extensions.Configuration;
using MijnApp_Backend.HttpClients;

namespace MijnApp_Backend.Security
{
    internal struct DigidConstants
    {
        internal const string Rid = "rid";
        internal const string ResultCode = "result_code";
        internal const string ASelectServer = "a-select-server";
        internal const string AppId = "app_id";
        internal const string AsUrl = "as_url";
        internal const string AppUrl = "app_url";
        internal const string AppLevel = "app_level";
        internal const string AuthspLevel = "authsp_level";
        internal const string Uid = "uid";
        internal const string Organization = "organization";
        internal const string TgtExpTime = "tgt_exp_time";
        internal const string Attributes = "attributes";
        internal const string SamlAttributes = "saml_attributes";
        internal const string SamlAttributeToken = "saml_attribute_token";
        internal const string SelectCredentials = "aselect_credentials";
        internal const string SharedSecret = "shared_secret";

        internal const string ResultCodeOk = "0000";
    }

    internal class DigidCgi
    {
        private const string SiamRedirectUrl = "{0}&"+ DigidConstants.ASelectServer + "={1}&" + DigidConstants.Rid + "={2}";
        private const string SiamRequestAuthenticationUrl = "{0}?request=authenticate&" + DigidConstants.AppId + "={1}&" + DigidConstants.AppUrl + "={2}&" + DigidConstants.ASelectServer + "={3}&" + DigidConstants.SharedSecret + "={4}";
        private const string SiamRequestVerifyUserUrl = "{0}?request=verify_credentials&"+ DigidConstants.ASelectServer + "={1}&"+ DigidConstants.Rid + "={2}&" + DigidConstants.SelectCredentials + "={3}&" + DigidConstants.SharedSecret + "={4}&" + DigidConstants.SamlAttributes + "={5}";

        private readonly IConfiguration _config;
        private readonly IDigidClient _digidClient;

        internal DigidCgi(IConfiguration config, IDigidClient digidClient)
        {
            _config = config;
            _digidClient = digidClient;
        }

        internal DigidUser AuthenticateFakeUser(string bsn)
        {
            var properties = new NameValueCollection();
            properties.Add(DigidConstants.Uid, bsn);
            properties.Add(DigidConstants.Organization, "someOrganization");
            properties.Add(DigidConstants.TgtExpTime, "645643632");

            var digidUser = new DigidUser(properties);
            return digidUser;
        }

        internal async Task<string> StartAuthenticateUser(string frontendRedirectUrl)
        {
            //Call to SIAM server
            var siamUrl = _config["DigidCgi:SiamServer"];
            var applicationId = _config["DigidCgi:ApplicationId"];
            var aSelectServer = _config["DigidCgi:SiamServerName"];

            var sharedSecret = _config["DigidCgi:SharedSecret"];

            var url = string.Format(SiamRequestAuthenticationUrl, siamUrl, applicationId, frontendRedirectUrl, aSelectServer, sharedSecret);

            var response = await _digidClient.GetAsync(url);
            string result = await response.Content.ReadAsStringAsync();

            var dict = HttpUtility.ParseQueryString(result);

            var resultCode = dict[DigidConstants.ResultCode];

            if (resultCode != null && resultCode.Equals(DigidConstants.ResultCodeOk))
            {
                var siamRedirectUrl = string.Format(SiamRedirectUrl, dict[DigidConstants.AsUrl], dict[DigidConstants.ASelectServer], dict[DigidConstants.Rid]);
                return siamRedirectUrl;
            }

            throw new Exception($"SIAM Result code: {resultCode}");
        }

        public async Task<DigidUser> VerifyUser(string aselectCredentials, string rid)
        {
            // Call to SIAM server
            var siamUrl = _config["DigidCgi:SiamServer"];
            var aSelectServer = _config["DigidCgi:SiamServerName"];

            var sharedSecret = _config["DigidCgi:SharedSecret"];
            var extraAttributes = "givenName";

            var url = string.Format(SiamRequestVerifyUserUrl, siamUrl, aSelectServer, rid, aselectCredentials, sharedSecret, extraAttributes);

            var response = await _digidClient.GetAsync(url);
            string result = await response.Content.ReadAsStringAsync();

            var digidValues = HttpUtility.ParseQueryString(result);

            var resultCode = digidValues[DigidConstants.ResultCode];

            if (!resultCode.Equals(DigidConstants.ResultCodeOk))
            {
                throw new Exception($"SIAM Result code: {resultCode}");
            }

            var demandedAuthenticationLevel = int.Parse(digidValues[DigidConstants.AppLevel]);
            var usedAuthenticationLevel = int.Parse(digidValues[DigidConstants.AuthspLevel]);

            if (demandedAuthenticationLevel > usedAuthenticationLevel)
            {
                // DigiD should make sure the user can only login at the desired level or higher. We just throw an exception when this happens.
                throw new Exception("Het gebruikte authenticatieniveau is {usedAuthenticationLevel}, maar moet minimaal {demandedAuthenticationLevel} zijn.");
            }

            var digidUser = new DigidUser(digidValues);
            return digidUser;
        }

        internal string SimpleLogoutUrl()
        {
            var siamUrl = _config["DigidCgi:SiamServer"];
            return siamUrl;
        }

        internal void ProlongSession(ClaimsPrincipal currentUser)
        {
            //TODO - implement Http call to SIAM server with aselect_credentials from user
        }

    }
}
