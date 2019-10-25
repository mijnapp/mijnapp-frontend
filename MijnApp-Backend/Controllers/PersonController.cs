using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MijnApp_Backend.HttpClients;
using MijnApp_Backend.Security;

using System.Threading.Tasks;
using MijnApp_Backend.Services;

namespace MijnApp_Backend.Controllers
{
    [Authorize]
    public class PersonController : Controller
    {
        private readonly PersonService _personService;

        public PersonController(IConfiguration config, IServiceClient serviceClient)
        {
            var jwtTokenProvider = new JwtTokenProvider(config);
            _personService = new PersonService(jwtTokenProvider, serviceClient, config);
        }

        [HttpGet]
        [Route("person")]
        public async Task<IActionResult> GetPerson()
        {
            var person = await _personService.GetPersonFromApi(User);
            return Json(person);
        }
        
        [HttpGet]
        [Route("familyfirstgrade")]
        public async Task<IActionResult> GetPersonsMovingAsync()
        {
            var personList = await _personService.GetPersonsMovingAsync(User);
            return Json(personList);
        }

    }
}