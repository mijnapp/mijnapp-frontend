using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace MijnApp_Backend.Controllers
{
    public class AddressController : Controller
    {
        [HttpGet]
        [Route("adres/{postalcode}/{number}")]
        public async Task<IActionResult> GetAddressAsync(string postalcode, string number)
        {
            if (postalcode == null || number == null)
            {
                return Json("");
            }
            using(var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync($"http://adressen.zaakonline.nl/adressen?postcode={postalcode}&huisnummer={number}");
                var result = await response.Content.ReadAsStringAsync();
                return Json(result);
            }
        }
    }
}
