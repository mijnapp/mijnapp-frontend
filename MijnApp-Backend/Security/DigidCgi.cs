using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Extensions.Configuration;

namespace MijnApp_Backend.Security
{
    internal class DigidCgi
    {
        private const string SiamRedirectUrl = "{0}&a-select-server={1}&rid={2}";
        private const string SiamRequestAuthenticationUrl = "{0}?request=authenticate&app_id={1}&app_url={2}&a-select-server={3}&shared_secret={4}";

        private readonly IConfiguration _config;

        internal DigidCgi(IConfiguration config)
        {
            _config = config;
        }

        internal string AuthenticateUser()
        {
            return "Paco del Taco";
        }

        internal async Task<string> StartAuthenticateUser()
        {
            //Call to SIAM server
            var siamUrl = _config["DigidCgi:SiamServer"];
            var applicationId = _config["DigidCgi:ApplicationId"];
            var redirectUrl = _config["DigidCgi:RedirectUrl"];
            var aSelectServer = _config["DigidCgi:SiamServerName"];

            var sharedSecret = _config["DigidCgi:SharedSecret"];

            var url = string.Format(SiamRequestAuthenticationUrl, siamUrl, applicationId, redirectUrl, aSelectServer, sharedSecret);

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
    }
}
