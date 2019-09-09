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
                    properties = new[] {"Test1", "Test2", "Test3"},
                    rsin = "100",
                    request_type = new RequestType
                    {
                        name = "verhuizen",
                        rsin = "1",
                        properties = new[]
                        {
                            new Property
                            {
                                title = "ingangsDatum",
                                type = "string",
                                format = "date",
                                description = "De datum waarop een persoon gaat verhuizen"
                            },
                            new Property
                            {
                                title = "adress",
                                type = "string",
                                format = "uri",
                                description = "De bag nummer aanduiding waar een persoon heen haat verhuizen"
                            },
                            new Property
                            {
                                title = "persoon",
                                type = "string",
                                format = "bsn",
                                description = "Persoon dat gaat verhuizen"
                            }
                        }
                    }
                };

                var stringContent = new StringContent(JsonConvert.SerializeObject(dataModel), Encoding.UTF8, "application/json");
                //response = await httpClient.PostAsync(string.Format(PostRequest, _baseUri), stringContent);
                //var result = await response.Content.ReadAsStringAsync();

                var mockResult = stringContent.ReadAsStringAsync().Result;
                return Json(mockResult);
            }
        }
    }

    internal class Request
    {
        public RequestType request_type { get; set; }
        public string rsin { get; set; }
        public string submitter { get; set; }
        public bool submitter_person { get; set; }
        public string[] properties { get; set; }
        public string[] cases { get; set; }
    }

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
        public string description { get; set; }

        /* Other fields, Discuss with conduction if these are needed in when creating the request.
        "multiple_of": null,
        "maximum": null,
        "exclusive_maximum": null,
        "minimum": null,
        "exclusive_minimum": null,
        "max_length": null,
        "min_length": null,
        "pattern": null,
        "additional_items": null,
        "max_items": null,
        "min_items": null,
        "unique_items": null,
        "max_properties": null,
        "min_properties": null,
        "required": true,
        "properties": null,
        "additional_properties": null,
        "object": null,
        "enum": [],        
        "default_value": null,
        "nullable": null,
        "read_only": null,
        "write_only": null,
        "external_doc": null,
        "example": null,
        "deprecated": null
        */
    }
}