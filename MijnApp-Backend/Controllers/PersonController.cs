using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MijnApp.Domain.Models;

namespace MijnApp_Backend.Controllers
{
    [Route("person")]
    [ApiController]
    [Authorize]
    public class PersonController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetPerson(string id)
        {
            var currentUser = HttpContext.User;
            string username = "Onbekend";
            if (currentUser.HasClaim(c => c.Type == JwtRegisteredClaimNames.Sub))
            {
                username = currentUser.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sub).Value;
            }
            var test = new Persoon
            {
                Id = new Guid("F5BA2997-AD97-4085-AF9F-03919A1067F2"),
                Voornamen = "Erik",
                Geslachtsnaam = username
            };
            return Ok(test);
        }
    }
}