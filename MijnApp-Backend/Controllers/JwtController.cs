using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MijnApp_Backend.Security;

namespace MijnApp_Backend.Controllers
{
    [Route("jwt")]
    [Authorize]
    public class JwtController : Controller
    {
        private readonly JwtTokenProvider _jwtTokenProvider;

        public JwtController(IConfiguration config)
        {
            _jwtTokenProvider = new JwtTokenProvider(config);
        }

        [HttpGet]
        [Route("index")]
        public IActionResult Index()
        {
            return Ok("Test");
        }

        [HttpPost]
        [Route("signin")]
        [AllowAnonymous]
        public IActionResult SigninDigidCgi()
        {
            var user = DigidCgi.AuthenticateUser();

            if (!string.IsNullOrEmpty(user))
            {
                var tokenString = _jwtTokenProvider.GenerateJsonWebToken(user);
                return Ok(new { token = tokenString });
            }

            return Unauthorized();
        }

        
    }
}