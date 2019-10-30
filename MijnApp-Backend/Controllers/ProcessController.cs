using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MijnApp_Backend.HttpClients;
using System.Threading.Tasks;

namespace MijnApp_Backend.Controllers
{
    //[Authorize]
    public class ProcessController : Controller
    {
        private readonly string _baseUri;
        private const string UrlGetAll = "{0}process_types";
        private const string UrlGetById = "{0}process_types/{1}";

        private readonly IServiceClient _serviceClient;

        public ProcessController(IConfiguration config, IServiceClient serviceClient)
        {
            _baseUri = config.GetValue<string>("Api:ProcessUri");
            _serviceClient = serviceClient;
        }

        [HttpGet]
        [Route("processes")]
        public async Task<IActionResult> Processes()
        {
            var response = await _serviceClient.GetAsync(string.Format(UrlGetAll, _baseUri));
            var result = await response.Content.ReadAsStringAsync();
            return Json(result);
        }

        [HttpGet]
        [Route("processes/{id}")]
        public async Task<IActionResult> GetProcessesById(string id)
        {
            var response = await _serviceClient.GetAsync(string.Format(UrlGetById, _baseUri, id));
            var result = await response.Content.ReadAsStringAsync();
            return Json(result);
        }
    }
}
