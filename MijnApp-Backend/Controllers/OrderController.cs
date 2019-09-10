using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using MijnApp_Backend.HttpClients;
using MijnApp_Backend.Security;

namespace MijnApp_Backend.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        private readonly JwtTokenProvider _jwtTokenProvider;
        private readonly string _baseUri;
        private readonly IServiceClient _serviceClient;
        private const string PostRequest = "{0}requests";

        public OrderController(IConfiguration config, IServiceClient serviceClient)
        {
            _baseUri = config.GetValue<string>("Api:OrderUri");
            _serviceClient = serviceClient;
            _jwtTokenProvider = new JwtTokenProvider(config);
        }

        [HttpPost]
        [Route("order")]
        public async Task<IActionResult> Order([FromBody]dynamic order)
        {
            var orderObject = JsonConvert.DeserializeObject<Order>(order.ToString());
            return await CallRequestApiAsync(orderObject);
        }

        private async Task<IActionResult> CallRequestApiAsync(Order order)
        {
            var bsn = _jwtTokenProvider.GetBsnFromClaims(HttpContext.User);
            using (var httpClient = new HttpClient())
            {
                HttpResponseMessage response;
                var dataModel = new Request
                {
                    submitter = bsn,
                    submitter_person = true,
                    cases = new string[0],
                    properties = new Dictionary<string, object>(),
                    rsin = "100",
                    request_type = "/request_types/" + order.requestType
                };
                foreach (var question in order.data.Where(q => q.question != "END"))
                {
                    if (question.value is string)
                    {
                        dataModel.properties.Add(question.key, question.value);
                    }
                    else
                    {
                        var values = string.Join(", ", question.value);
                        dataModel.properties.Add(question.key, values);
                    }
                }

                var stringContent = new StringContent(JsonConvert.SerializeObject(dataModel), Encoding.UTF8, "application/json");
                //response = await httpClient.PostAsync(string.Format(PostRequest, _baseUri), stringContent);
                //var result = await response.Content.ReadAsStringAsync();
                var requestString = stringContent.ReadAsStringAsync().Result;
                return Json(requestString);
            }
        }
    }

    public class Order
    {
        public List<Question> data { get; set; }
        public string requestType { get; set; }
    }

    public class Question
    {
        public string question { get; set; }
        public string key { get; set; }
        public dynamic value { get; set; }
        public string keyTitle { get; set; }
        public dynamic valueTitle { get; set; }
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