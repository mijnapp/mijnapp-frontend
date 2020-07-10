using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MijnApp.Domain.Models;
using MijnApp_Backend.HttpClients;
using MijnApp_Backend.Security;
using Newtonsoft.Json;

namespace MijnApp_Backend.Services
{
    internal class PersonService
    {
        private readonly string _baseUri;
        private const string UrlGetByBsn = "{0}ingeschrevenpersonen/{1}";
        private const string UrlGetByBsnWithFamily = "{0}ingeschrevenpersonen/{1}?geefFamilie=true";
        private const string UrlGetPersonsOnAddressWithBagId = "{0}ingeschrevenpersonen?familie_eerstegraad={1}&verblijfplaats__identificatiecodenummeraanduiding={2}";
        private const string UrlGetPersonsOnAddressWithoutBagId = "{0}ingeschrevenpersonen?familie_eerstegraad={1}";
        private const string UrlGetPersonOnGuid = "{0}ingeschrevenpersonen/uuid/{1}";

        private readonly JwtTokenProvider _jwtTokenProvider;
        private readonly IServiceClient _serviceClient;

        internal PersonService(JwtTokenProvider jwtTokenProvider, IServiceClient serviceClient, IConfiguration config)
        {
            _baseUri = config.GetValue<string>("Api:BrpUri");
            _jwtTokenProvider = jwtTokenProvider;
            _serviceClient = serviceClient;
            _serviceClient.SetApiKey(config.GetValue<string>("Api:BrpApiKey"));
        }

        internal async Task<Persoon> GetPersonFromApi(ClaimsPrincipal user)
        {
            var bsn = _jwtTokenProvider.GetBsnFromClaims(user);
            var url = string.Format(UrlGetByBsn, _baseUri, bsn);
            var result = await CallApi(url);
            var person = JsonConvert.DeserializeObject<Persoon>(result);
            return person;
        }

        internal async Task<Persoon> GetPersonWithFamilyFromApi(ClaimsPrincipal user)
        {
            var bsn = _jwtTokenProvider.GetBsnFromClaims(user);
            var url = string.Format(UrlGetByBsnWithFamily, _baseUri, bsn);
            var result = await CallApi(url);
            var person = JsonConvert.DeserializeObject<Persoon>(result);
            return person;
        }

        internal async Task<List<Persoon>> GetPersonsMovingAsync(ClaimsPrincipal user)
        {
            var personList = new List<Persoon>();
            var familyBsns = new List<string>();
            var personWithFamily = await GetPersonWithFamilyFromApi(user);
            personList.Add(personWithFamily);
            var personAddressDescription = personWithFamily.verblijfplaats.AddressString();

            //Mee verhuizers zijn eerstegraad familie: zit zijn de partners, ouders en kinderen.
            if (personWithFamily.partners != null)
            {
                var partnerBsns = personWithFamily.partners.Select(o => o.bsn);
                familyBsns.AddRange(partnerBsns);
            }
            if (personWithFamily.ouders != null)
            {
                var ouderBsns = personWithFamily.ouders.Select(o => o.bsn);
                familyBsns.AddRange(ouderBsns);
            }
            if (personWithFamily.kinderen != null)
            {
                var kindBsns = personWithFamily.kinderen.Select(o => o.bsn);
                familyBsns.AddRange(kindBsns);
            }

            foreach (var bsn in familyBsns)
            {
                var url = string.Format(UrlGetByBsn, _baseUri, bsn);
                var result = await CallApi(url);
                var person = JsonConvert.DeserializeObject<Persoon>(result);

                var familyAddressDescription = person.verblijfplaats.AddressString();
                if (personAddressDescription == familyAddressDescription)
                {
                    personList.Add(person);
                }
            }

            return personList;
        }

        internal async Task<PersoonV2> GetPersonFromApiFromGuid(string guid)
        {
            var url = string.Format(UrlGetPersonOnGuid, _baseUri, guid);
            var result = await CallApi(url);
            var person = JsonConvert.DeserializeObject<PersoonV2>(result);
            return person;
        }

        internal async Task<string> CallApi(string url)
        {
            var response = await _serviceClient.GetAsync(url);
            return await response.Content.ReadAsStringAsync();
        }
    }
}
