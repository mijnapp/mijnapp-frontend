using System;
using Microsoft.AspNetCore.Mvc;
using MijnApp.Domain.Models;

namespace MijnApp_Backend.Controllers
{
    [Route("jwt")]
    public class JwtController : Controller
    {
        [HttpGet]
        [Route("index")]
        public IActionResult Index()
        {
            return Ok("Test");
        }

        [HttpPost]
        [Route("signin")]
        public IActionResult SigninPost()
        {
            var test = new Persoon
            {
                Id = new Guid("F5BA2997-AD97-4085-AF9F-03919A1067F2")
            };
            return Json(test);
        }
    }
}