using System;
using Microsoft.AspNetCore.Mvc;
using MijnApp.Domain.Models;

namespace MijnApp_Backend.Controllers
{
    [Route("person")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetPerson(string id)
        {
            var test = new Persoon
            {
                Id = new Guid("F5BA2997-AD97-4085-AF9F-03919A1067F2"),
                Voornamen = "Erik",
                Geslachtsnaam = "Versteeg"
            };
            return Ok();
        }
    }
}