using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MijnApp.Domain.Models;
using MijnApp_Backend.HttpClients;
using MijnApp_Backend.Security;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MijnApp_Backend.Services
{
    internal class PersonService
    {
        private readonly string _baseUri;
        private const string UrlGetByBsn = "{0}ingeschrevenpersonen/{1}";
        private const string UrlGetPersonsOnAddress = "{0}ingeschrevenpersonen?familie_eerstegraad={1}&verblijfplaats__identificatiecodenummeraanduiding={2}";

        private readonly JwtTokenProvider _jwtTokenProvider;
        private readonly IServiceClient _serviceClient;
        
        internal PersonService(JwtTokenProvider jwtTokenProvider, IServiceClient serviceClient, IConfiguration config)
        {
            _baseUri = config.GetValue<string>("Api:BrpUri");
            _jwtTokenProvider = jwtTokenProvider;
            _serviceClient = serviceClient;
        }

        internal async Task<Persoon> GetPersonFromApi(ClaimsPrincipal user)
        {
            var bsn = _jwtTokenProvider.GetBsnFromClaims(user);
            var url = string.Format(UrlGetByBsn, _baseUri, bsn);
            var result = await CallApi(url);
            var person = JsonConvert.DeserializeObject<Persoon>(result);
            return person;
        }

        internal async Task<List<Persoon>> GetPersonsMovingAsync(ClaimsPrincipal user)
        {
            var person = await GetPersonFromApi(user);

            var bsn = _jwtTokenProvider.GetBsnFromClaims(user);
            var bagId = person.verblijfplaats.id;
            //Call Url for persons on address
            var url = string.Format(UrlGetPersonsOnAddress, _baseUri, bsn, bagId);
            var result = await CallApi(url);
            var token = JObject.Parse(result);
            var list = (JArray)token.SelectToken("_embedded.item");
            var personList = list.ToObject<List<Persoon>>();
            personList.Insert(0, person);
            return personList;
        }

        private async Task<string> GetBagIdForPerson(ClaimsPrincipal user)
        {
            var person = await GetPersonFromApi(user);
            return person.verblijfplaats.id;
        }


        internal async Task<string> CallApi(string url)
        {
            var response = await _serviceClient.GetAsync(url);
            return await response.Content.ReadAsStringAsync();
        }
    }
}
