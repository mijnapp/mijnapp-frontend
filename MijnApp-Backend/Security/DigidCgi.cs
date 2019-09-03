using System;
using System.Collections.Specialized;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Extensions.Configuration;

namespace MijnApp_Backend.Security
{
    internal class DigidCgi
    {
        private const string SiamRedirectUrl = "{0}&a-select-server={1}&rid={2}";
        private const string SiamRequestAuthenticationUrl = "{0}?request=authenticate&app_id={1}&app_url={2}&a-select-server={3}&shared_secret={4}";
        private const string SiamRequestVerifyUserUrl = "{0}?request=verify_credentials&a-select-server={1}&rid={2}&aselect_credentials={3}&shared_secret={4}";

        private readonly IConfiguration _config;

        internal DigidCgi(IConfiguration config)
        {
            _config = config;
        }

        internal DigidUser AuthenticateFakeUser()
        {
            var properties = new NameValueCollection();
            properties.Add("uid", "testuseridPaco");
            properties.Add("organization", "someorganizationfromPaco");
            properties.Add("tgt_exp_time", "645643632");

            var digidUser = new DigidUser(properties);
            digidUser.Username = "Paco del Taco";
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

            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(url);
                string result = await response.Content.ReadAsStringAsync();

                var dict = HttpUtility.ParseQueryString(result);

                var resultCode = dict["result_code"];

                if (resultCode.Equals("0000"))
                {
                    var siamRedirectUrl = string.Format(SiamRedirectUrl, dict["as_url"], dict["a-select-server"],
                        dict["rid"]);
                    return siamRedirectUrl;
                }

                //TODO - Error handling in case result code is not 0000
                throw new Exception($"SIAM Result code: {resultCode}");
            }
        }

        public async Task<DigidUser> VerifyUser(string aselectCredentials, string rid)
        {
            // Call to SIAM server
            var siamUrl = _config["DigidCgi:SiamServer"];
            var aSelectServer = _config["DigidCgi:SiamServerName"];

            var sharedSecret = _config["DigidCgi:SharedSecret"];

            var url = string.Format(SiamRequestVerifyUserUrl, siamUrl, aSelectServer, rid, aselectCredentials, sharedSecret);

            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(url);
                string result = await response.Content.ReadAsStringAsync();

                var dict = HttpUtility.ParseQueryString(result);

                var resultCode = dict["result_code"];

                if (!resultCode.Equals("0000"))
                {
                    //TODO - Error handling in case result code is not 0000
                    throw new Exception($"SIAM Result code: {resultCode}");
                }

                var digidUser = new DigidUser(dict);
                return digidUser;
            }
        }

        internal void ProlongSession(ClaimsPrincipal currentUser)
        {
            //TODO - implement Http call to SIAM server with rid from user claim
        }

    }
}
