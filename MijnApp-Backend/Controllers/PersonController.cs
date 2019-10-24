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
            var person = await GetPersonFromApi();
            return Json(person);
        }
        
        [HttpGet]
        [Route("familyfirstgrade")]
        public async Task<IActionResult> GetPersonsMovingAsync()
        {
            //Call Brp to get current address id
            var person = await GetPersonFromApi();

            var bsn = _jwtTokenProvider.GetBsnFromClaims(User);
            var bagId = person.verblijfplaats.id;
            //Call Url for persons on address
            var url = string.Format(UrlGetPersonsOnAddress, _baseUri, bsn, bagId);
            var result = await CallApi(url);
            var token = JObject.Parse(result);
            var list = (JArray)token.SelectToken("_embedded.item");
            var personList = list.ToObject<List<Persoon>>();
            personList.Insert(0, person);
            return Json(personList);
        }

        private async Task<Persoon> GetPersonFromApi()
        {
            var bsn = _jwtTokenProvider.GetBsnFromClaims(User);
            var url = string.Format(UrlGetByBsn, _baseUri, bsn);
            var result = await CallApi(url);
            var person = JsonConvert.DeserializeObject<Persoon>(result);
            return person;
        }

        private async Task<string> GetBagIdForPerson()
        {
            var person = await GetPersonFromApi();
            return person.verblijfplaats.id;
        }

        private async Task<string> CallApi(string url)
        {
            var response = await _serviceClient.GetAsync(url);
            return await response.Content.ReadAsStringAsync();
        }
    }
}