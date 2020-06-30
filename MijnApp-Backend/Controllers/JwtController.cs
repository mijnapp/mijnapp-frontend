﻿using log4net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MijnApp_Backend.Helpers;
using MijnApp_Backend.HttpClients;
using MijnApp_Backend.Security;
using System;
using System.Threading.Tasks;

namespace MijnApp_Backend.Controllers
{
    [Route("jwt")]
    [Authorize]
    public class JwtController : Controller
    {
        private readonly IConfiguration _config;
        private readonly JwtTokenProvider _jwtTokenProvider;
        private readonly DigidCgi _digidCgi;
        private readonly ILog _auditLogger;

        public JwtController(IConfiguration config, IDigidClient digidClient)
        {
            _config = config;
            _jwtTokenProvider = new JwtTokenProvider(config);
            _digidCgi = new DigidCgi(config, digidClient);
            _auditLogger = Log4NetLogManager.AuditLogger;
        }

        [HttpGet]
        [Route("signin")]
        [AllowAnonymous]
        public async Task<IActionResult> StartSignInDigid([FromQuery]string frontEndRedirectTo)
        {
            _auditLogger.Info("StartSignInDigid aangeroepen");
            CheckFrontendRedirectUrl(frontEndRedirectTo);

            var redirectUrl = await _digidCgi.StartAuthenticateUser(frontEndRedirectTo);

            return Ok(new { redirectTo = redirectUrl });
        }

        [HttpPost]
        [Route("getJwtForDigidCgi")]
        [AllowAnonymous]
        public async Task<IActionResult> GetJwtForDigidCgi([FromQuery]string aselectCredentials, [FromQuery]string rid)
        {
            _auditLogger.Info("GetJwtForDigidCgi aangeroepen");

            var user = await _digidCgi.VerifyUser(aselectCredentials, rid);

            var tokenString = _jwtTokenProvider.GenerateJsonWebToken(user, SignInProvider.DigidCgi);

            return Ok(new
            {
                token = tokenString,
                user = new { id = "testUserId" }
            });
        }

        [HttpPost]
        [Route("signout")]
        public IActionResult SignOut()
        {
            var correlationId = JwtTokenProvider.GetCorrelationIdForLogging(HttpContext.User);
            _auditLogger.Info("Gebruiker uitgelogd", correlationId);

            return Ok(new
            {
                simpleLogoutUrl = _digidCgi.SimpleLogoutUrl()
            });
        }

        [HttpPost]
        [Route("signinfake")]
        [AllowAnonymous]
        public IActionResult SigninDigidCgiFake([FromServices] IConfiguration config)
        {
            _auditLogger.Info("SigninDigidCgiFake aangeroepen - dit is de Fake inlog");
            var hasFakeLoginEnabled = config.GetValue<bool>("HasFakeLoginEnabled");
            if (!hasFakeLoginEnabled)
            {
                return BadRequest("Fake login is disabled");
            }
            var user = _digidCgi.AuthenticateFakeUser();

            var tokenString = _jwtTokenProvider.GenerateJsonWebToken(user, SignInProvider.FakeLogin);
            return Ok(new
            {
                token = tokenString,
                user = new { id = "testUserId" }
            });
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