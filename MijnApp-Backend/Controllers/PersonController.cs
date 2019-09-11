using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MijnApp_Backend.HttpClients;
using MijnApp_Backend.Security;

namespace MijnApp_Backend.Controllers
{
    [Authorize]
    public class PersonController : Controller
    {
        private readonly string _baseUri;
        private const string UrlGetAll = "{0}ingeschrevenpersonen";
        private const string UrlGetById = "{0}ingeschrevenpersonen/{1}";

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
            var result = await _serviceClient.GetAsync(string.Format(UrlGetById, _baseUri, bsn));
            return Json(result);

        }

        [HttpGet]
        [Route("personsMoving")]
        public IActionResult GetPersonsMoving()
        {
            var persons = new List<PersonMoving>
            {
                new PersonMoving("9999999", "Evelien de Vries"),
                new PersonMoving("8888888", "Thomas de Vries"),
            };
            return Ok(persons);
        }

        internal class PersonMoving
        {
            public string Id { get; set; }
            public string Name { get; set; }

            public PersonMoving(string id, string name)
            {
                Id = id;
                Name = name;
            }
        }
    }
}