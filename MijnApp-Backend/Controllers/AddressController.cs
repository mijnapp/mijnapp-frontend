using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;

namespace MijnApp_Backend.Controllers
{
    public class AddressController : Controller
    {
        private const string URL_NoNumberAddition = "http://adressen.zaakonline.nl/adressen?postcode={0}&huisnummer={1}";
        private const string URL_WithNumberAddition = "http://adressen.zaakonline.nl/adressen?postcode={0}&huisnummer={1}&huisnummer_toevoeging={2}";

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
                    response = await httpClient.GetAsync(string.Format(URL_NoNumberAddition, postalcode, number));
                }
                else
                {
                    response = await httpClient.GetAsync(string.Format(URL_WithNumberAddition, postalcode, number, numberAddition));
                }
                var result = await response.Content.ReadAsStringAsync();
                return Json(result);
            }
        }
    }
}
