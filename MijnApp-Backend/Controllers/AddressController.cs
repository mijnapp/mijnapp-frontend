using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace MijnApp_Backend.Controllers
{
    [Authorize]
    public class AddressController : Controller
    {
        private readonly string BaseUri = "";
        private const string NoNumberAddition = "{0}adressen?postcode={1}&huisnummer={2}";
        private const string WithNumberAddition = "{0}adressen?postcode={1}&huisnummer={2}&huisnummertoevoeging={3}";

        public AddressController([FromServices] IConfiguration config)
        {
            BaseUri = config.GetValue<string>("Api:AddressUri");
        }

        [HttpGet]
        [Route("address/{postalcode}/{number}/")]
        public async Task<IActionResult> GetAddressAsync(string postalcode, string number)
        {
            return await CallAddressApiAsync(postalcode, number, null);
        }

        [HttpGet]
        [Route("address/{postalcode}/{number}/{numberAddition}")]
        public async Task<IActionResult> GetAddressFullAsync(string postalcode, string number, string numberAddition)
        {
            return await CallAddressApiAsync(postalcode, number, numberAddition);
        }

        private async Task<IActionResult> CallAddressApiAsync(string postalcode, string number, string numberAddition)
        {
            if (postalcode == null || number == null)
            {
                return Json("");

            }
            using (var httpClient = new HttpClient())
            {
                HttpResponseMessage response;
                if (string.IsNullOrWhiteSpace(numberAddition))
                {
                    response = await httpClient.GetAsync(string.Format(NoNumberAddition, BaseUri, postalcode, number));
                }
                else
                {
                    response = await httpClient.GetAsync(string.Format(WithNumberAddition, BaseUri, postalcode, number, numberAddition));
                }
                var result = await response.Content.ReadAsStringAsync();
                return Json(result);
            }
        }
    }
}
