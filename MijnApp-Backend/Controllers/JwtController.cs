using System;
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
        private readonly IConfiguration _config;
        private readonly JwtTokenProvider _jwtTokenProvider;
        private readonly DigidCgi _digidCgi;

        public JwtController(IConfiguration config)
        {
            _config = config;
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
            CheckFrontendRedirectUrl(frontEndRedirectTo);

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
                var tokenString = _jwtTokenProvider.GenerateJsonWebToken(user, SignInProvider.FakeLogin);
                return Ok(new
                {
                    token = tokenString,
                    user = new { id = "testUserId"}
                });
            }

            return Unauthorized();
        }


        private void CheckFrontendRedirectUrl(string redirectUrl)
        {
            if (string.IsNullOrWhiteSpace(redirectUrl))
            {
                throw new Exception("The redirect URL can't be empty");
            }

            //The redirect URL has to be one of our known front end URLs
            var allowedOrigins = _config.GetValue<string>("Origins").ToLower().Split(';');

            foreach (var allowedOrigin in allowedOrigins)
            {
                if (redirectUrl.ToLower().StartsWith(allowedOrigin))
                {
                    return;
                }
            }

            throw new Exception("The redirect URL is not from an allowed origin");
        }
    }
}