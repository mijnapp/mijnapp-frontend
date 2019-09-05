using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace MijnApp_Backend.Controllers
{
    //[Authorize]
    public class ProcessController : Controller
    {
        private readonly string BaseUri = "";
        private const string URL_GETALL = "{0}processes";
        private const string URL_GETBYID = "{0}processes/{1}";

        public ProcessController([FromServices] IConfiguration config)
        {
            BaseUri = config.GetValue<string>("Api:ProcessUri");
        }

        [HttpGet]
        [Route("processes")]
        public async Task<IActionResult> Processes()
        {
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(string.Format(URL_GETALL, BaseUri));                
                var result = await response.Content.ReadAsStringAsync();
                return Json(result);
            }
        }

        [HttpGet]
        [Route("processes/{id}")]
        public async Task<IActionResult> GetProcessesById(string id)
        {
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(string.Format(URL_GETBYID, BaseUri, id));
                var result = await response.Content.ReadAsStringAsync();
                return Json(result);
            }
        }
    }
}
