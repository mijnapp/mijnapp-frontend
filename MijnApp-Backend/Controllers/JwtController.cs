using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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
        private readonly DigidCgi _digidCgi;

        public JwtController(IConfiguration config)
        {
            _jwtTokenProvider = new JwtTokenProvider(config);
            _digidCgi = new DigidCgi(config);
        }

        [HttpGet]
        [Route("index")]
        public IActionResult Index()
        {
            return Ok("Test");
        }

        [HttpGet]
        [Route("signin")]
        [AllowAnonymous]
        public async Task<IActionResult> StartSignInDigid([FromQuery]string frontEndRedirectTo)
        {
            //TODO - we should check this frontEndRedirectTo that it's from one of the clients we know

            var redirectUrl = await _digidCgi.StartAuthenticateUser(frontEndRedirectTo);

            return Ok(new { redirectTo = redirectUrl });
        }

        [HttpPost]
        [Route("signin")]
        [AllowAnonymous]
        public IActionResult SigninDigidCgi()
        {
            var user = _digidCgi.AuthenticateUser();

            if (!string.IsNullOrEmpty(user))
            {
                var tokenString = _jwtTokenProvider.GenerateJsonWebToken(user);
                return Ok(new { token = tokenString });
            }

            return Unauthorized();
        }

        
    }
}