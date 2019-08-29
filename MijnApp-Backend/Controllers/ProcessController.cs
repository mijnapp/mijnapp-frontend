using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace MijnApp_Backend.Controllers
{
    //[Authorize]
    public class ProcessController : Controller
    {
        private const string URL_GETALL = "http://processes.zaakonline.nl/processes";
        private const string URL_GETBYID = "http://processes.zaakonline.nl/processes/{0}";

        [HttpGet]
        [Route("processes")]
        public async Task<IActionResult> Processes()
        {
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(URL_GETALL);                
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
                var response = await httpClient.GetAsync(string.Format(URL_GETBYID, id));
                var result = await response.Content.ReadAsStringAsync();
                return Json(result);
            }
        }
    }
}
