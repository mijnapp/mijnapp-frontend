using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MijnApp_Backend.HttpClients;
using MijnApp_Backend.Security;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MijnApp_Backend.Controllers
{
    [Authorize]
    public class ContractController : Controller
    {
        private readonly JwtTokenProvider _jwtTokenProvider;
        private readonly string _baseUri;
        private readonly IServiceClient _serviceClient;
        
        public ContractController(IConfiguration config, IServiceClient serviceClient)
        {
            _baseUri = config.GetValue<string>("Api:ContractUri");
            _serviceClient = serviceClient;
            _serviceClient.SetApiKey(config.GetValue<string>("Api:ContractApiKey"));
            _jwtTokenProvider = new JwtTokenProvider(config);
        }

        [HttpGet]
        [Route("contracts")]
        public async Task<IActionResult> GetContracts()
        {
            var bsn = _jwtTokenProvider.GetBsnFromClaims(HttpContext.User);
            var url = _baseUri.Replace("{bsn}", bsn);
            var response = await _serviceClient.GetAsync(url);
            var result = await response.Content.ReadAsStringAsync();
            var allContracts = JsonConvert.DeserializeObject<List<Contract>>(result);

            return Json(allContracts);
        }

        // ReSharper disable InconsistentNaming
        public class Contract
        {
            public string Identificatie { get; set; }
            public string Bsn { get; set; }
            public string Titel { get; set; }
            public string Status { get; set; }
            public DateTime BeginDatum { get; set; }
            public DateTime? EindDatum { get; set; }
            public string Organisatie { get; set; }
        }
        // ReSharper restore InconsistentNaming
    }
}