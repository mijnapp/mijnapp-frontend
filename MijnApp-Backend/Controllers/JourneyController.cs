﻿using System;
using System.Globalization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MijnApp_Backend.HttpClients;
using MijnApp_Backend.Security;
using MijnApp_Backend.Services;

namespace MijnApp_Backend.Controllers
{
    [Route("journey")]
    [Authorize]
    public class JourneyController : Controller
    {
        private const string JourneyIdVerhuizen = "9d76fb58-0711-4437-acc4-9f4d9d403cdf";
        private readonly PersonService _personService;

        public JourneyController(IConfiguration config, IServiceClient serviceClient)
        {
            var jwtTokenProvider = new JwtTokenProvider(config);
            _personService = new PersonService(jwtTokenProvider, serviceClient, config);
        }

        /// <summary>
        /// This is a temporary service. The process API should return if the user is allowed to start the journey or not.
        /// For now we build the logic ourselves.
        /// </summary>
        /// <param name="journeyId"></param>
        /// <returns></returns>
        [Route("{journeyId}/checkPreconditions")]
        public async Task<IActionResult> CheckPreconditions(string journeyId)
        {
            if (journeyId.Equals(JourneyIdVerhuizen))
            {
                //Check the preconditions for the verhuizen journey
                var preconditionsFullFilled = await PreconditionsFullFilledForVerhuizen();
                return Ok(new
                {
                    preconditionsFullFilled
                });
            }
            return Ok(new
            {
                preconditionsFullFilled = true
            });
        }

        private async Task<bool> PreconditionsFullFilledForVerhuizen()
        {
            var loggedInPerson = await _personService.GetPersonFromApi(User);

            return loggedInPerson.leeftijd >= 16;
        }
    }
}