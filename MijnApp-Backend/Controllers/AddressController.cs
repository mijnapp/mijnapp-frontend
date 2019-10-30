using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MijnApp_Backend.HttpClients;
using System.Net.Http;
using System.Threading.Tasks;

namespace MijnApp_Backend.Controllers
{
    [Route("address")]
    [Authorize]
    public class AddressController : Controller
    {
        private readonly string _baseUri;
        private const string NoNumberAddition = "{0}adressen?postcode={1}&huisnummer={2}";
        private const string WithNumberAddition = "{0}adressen?postcode={1}&huisnummer={2}&huisnummertoevoeging={3}";

        private readonly IServiceClient _serviceClient;

        public AddressController(IConfiguration config, IServiceClient serviceClient)
        {
            _baseUri = config.GetValue<string>("Api:AddressUri");
            _serviceClient = serviceClient;
        }

        [HttpGet]
        [Route("{postalcode}/{number}/")]
        public async Task<IActionResult> GetAddressAsync(string postalcode, string number)
        {
            return await CallAddressApiAsync(postalcode, number, null);
        }

        [HttpGet]
        [Route("{postalcode}/{number}/{numberAddition}")]
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

            HttpResponseMessage response;
            if (string.IsNullOrWhiteSpace(numberAddition))
            {
                response = await _serviceClient.GetAsync(string.Format(NoNumberAddition, _baseUri, postalcode, number));
            }
            else
            {
                response = await _serviceClient.GetAsync(string.Format(WithNumberAddition, _baseUri, postalcode, number, numberAddition));
            }
            var result = await response.Content.ReadAsStringAsync();
            return Json(result);
        }
    }
}
