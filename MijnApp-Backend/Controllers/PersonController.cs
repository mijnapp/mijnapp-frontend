using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MijnApp.Domain.Models;
using MijnApp_Backend.HttpClients;
using MijnApp_Backend.Security;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MijnApp_Backend.Controllers
{
    [Authorize]
    public class PersonController : Controller
    {
        private readonly string _baseUri;
        private const string UrlGetByBsn = "{0}ingeschrevenpersonen/{1}";
        private const string UrlGetPersonsOnAddress = "{0}ingeschrevenpersonen?familie_eerstegraad={1}&verblijfplaats__identificatiecodenummeraanduiding={2}";

        private readonly JwtTokenProvider _jwtTokenProvider;
        private readonly IServiceClient _serviceClient;

        public PersonController(IConfiguration config, IServiceClient serviceClient)
        {
            _baseUri = config.GetValue<string>("Api:BrpUri");
            _serviceClient = serviceClient;
            _jwtTokenProvider = new JwtTokenProvider(config);
        }

        [HttpGet]
        [Route("person")]
        public async Task<IActionResult> GetPerson()
        {
            var bsn = _jwtTokenProvider.GetBsnFromClaims(User);
            var response = await _serviceClient.GetAsync(string.Format(UrlGetByBsn, _baseUri, bsn));
            var result = await response.Content.ReadAsStringAsync();
            var person = JsonConvert.DeserializeObject(result, typeof(Persoon));
            return Json(person);
        }

        //[HttpGet]
        //[Route("personsMoving")]
        //public async Task<IActionResult> GetPersonsMovingAsync()
        //{
        //    //Call Brp to get current address id
        //    //var bsn = _jwtTokenProvider.GetBsnFromClaims(User);
        //    var bsn = "900003509";
        //    var response1 = await _serviceClient.GetAsync(string.Format(UrlGetByBsn, _baseUri, bsn));
        //    var result1 = await response1.Content.ReadAsStringAsync();
        //    var token = JObject.Parse(result1);
        //    var bagId = (string)token.SelectToken("verblijfplaats.id");
        //    var huisletter = (string)token.SelectToken("verblijfplaats.huisletter");
        //    var huisnummer = (string)token.SelectToken("verblijfplaats.huisnummer");
        //    var huisnummertoevoeging = (string)token.SelectToken("verblijfplaats.huisnummertoevoeging");
        //    var postcode = (string)token.SelectToken("verblijfplaats.postcode");

        //    var url = "http://brp.zaakonline.nl/ingeschrevenpersonen?familie_eerstegraad=" + bsn +
        //              "&verblijfplaats__huisletter=" + huisletter +
        //              "&verblijfplaats__huisnummer=" + huisnummer +
        //              "&verblijfplaats__huisnummertoevoeging=" + huisnummertoevoeging +
        //              "&verblijfplaats__postcode=" + postcode;
        //    //Call Url for persons on address
        //    var response = await _serviceClient.GetAsync(url);
        //    var result = await response.Content.ReadAsStringAsync();

        //    return Json(result);
        //}

        [HttpGet]
        [Route("personsmoving")]
        public async Task<IActionResult> GetPersonsMovingOldAsync()
        {
            //Call Brp to get current address id
            var bsn = _jwtTokenProvider.GetBsnFromClaims(User);
            var bagId = GetBagIdForPerson(bsn);

            //Call Url for persons on address
            var response = await _serviceClient.GetAsync(string.Format(UrlGetPersonsOnAddress, _baseUri, bsn, bagId));
            var result = await response.Content.ReadAsStringAsync();
            var token = JObject.Parse(result);
            var embedded = (JObject)token.SelectToken("_embedded");
            var list = (JArray)embedded.SelectToken("item");
            var personList = list.ToObject<List<Persoon>>();
            return Json(personList);
        }

        private async Task<string> GetBagIdForPerson(string bsn)
        {
            var response = await _serviceClient.GetAsync(string.Format(UrlGetByBsn, _baseUri, bsn));
            var result = await response.Content.ReadAsStringAsync();
            var token = JObject.Parse(result);
            return (string)token.SelectToken("verblijfplaats.id");
        }
    }
}