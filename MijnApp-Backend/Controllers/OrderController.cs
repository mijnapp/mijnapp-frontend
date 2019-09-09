using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using MijnApp_Backend.HttpClients;

namespace MijnApp_Backend.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        private readonly string _baseUri;
        private readonly IServiceClient _serviceClient;
        private const string PostRequest = "{0}requests";

        public OrderController(IConfiguration config, IServiceClient serviceClient)
        {
            _baseUri = config.GetValue<string>("Api:OrderUri");
            _serviceClient = serviceClient;
        }

        [HttpPost]
        [Route("order")]
        public async Task<IActionResult> Order(dynamic data)
        {
            return await CallRequestApiAsync("");
        }

        private async Task<IActionResult> CallRequestApiAsync(string empty)
        {
            using (var httpClient = new HttpClient())
            {
                HttpResponseMessage response;
                var dataModel = new Request
                {
                    submitter = "Solviteers Sjoerd test",
                    submitter_person = true,
                    cases = new string[0],
                    properties = new Dictionary<string, object>
                    {
                        {"IngangsDatum", "09-09-2019"},
                        {"Adress", "0384200000016667"},
                        {"Persoon", "123456782"},
                    },
                    rsin = "100",
                    request_type = "/request_types/06daeb7f-6503-4b8e-8aa1-5a5767b53b22"
                };

                var stringContent = new StringContent(JsonConvert.SerializeObject(dataModel), Encoding.UTF8, "application/json");
                //response = await httpClient.PostAsync(string.Format(PostRequest, _baseUri), stringContent);
                //var result = await response.Content.ReadAsStringAsync();
                var requestString = stringContent.ReadAsStringAsync().Result;
                return Json(requestString);
            }
        }
    }

    internal class Request
    {
        public string request_type { get; set; }
        public string rsin { get; set; }
        public string submitter { get; set; }
        public bool submitter_person { get; set; }
        public Dictionary<string,object> properties { get; set; }
        public string[] cases { get; set; }
    }

    /*

    Not needed yet.

    internal class RequestType
    {
        public string rsin { get; set; }
        public string name { get; set; }
        public Property[] properties { get; set; }
        public RequestType extends { get; set; }
    }

    internal class Property
    {
        public string title { get; set; }
        public string type { get; set; }
        public string format { get; set; }

        //Other fields are not required!
    }

    */
}