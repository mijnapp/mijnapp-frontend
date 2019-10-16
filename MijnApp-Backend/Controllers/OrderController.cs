﻿using System.Collections.Generic;
using System.Linq;
using System.Net;
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
        private readonly string _processBaseUri;
        private readonly IServiceClient _serviceClient;
        private const string PostRequest = "{0}requests";
        private const string TARGET_ORGANIZATION_DEN_BOSCH = "1709124";

        public OrderController(IConfiguration config, IServiceClient serviceClient)
        {
            _baseUri = config.GetValue<string>("Api:OrderUri");
            _processBaseUri = config.GetValue<string>("Api:ProcessUri");
            _serviceClient = serviceClient;
            _jwtTokenProvider = new JwtTokenProvider(config);
        }

        [HttpPost]
        [Route("order")]
        public async Task<IActionResult> Order([FromBody] dynamic order)
        {
            var orderObject = JsonConvert.DeserializeObject<Order>(order.ToString());
            return await CallRequestApiAsync(orderObject);
        }

        private async Task<IActionResult> CallRequestApiAsync(Order order)
        {
            var bsn = _jwtTokenProvider.GetBsnFromClaims(HttpContext.User);
            var requestData = CreateRequestData(order, bsn);
            var stringContent = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");
            var response = await _serviceClient.PostAsync(string.Format(PostRequest, _baseUri), stringContent);
            var result = await response.Content.ReadAsStringAsync();
            if (response.StatusCode == HttpStatusCode.Created)
            {
                ////Retrieve the "request url" from the response.
                //dynamic resultDynamic = JsonConvert.DeserializeObject<dynamic>(result);
                //var self = resultDynamic._links.self;
                //return Json(self);
                return Ok();
            }

            return BadRequest(Json(result));
        }

        /// <summary>
        /// Create an "request" (verzoek) to send to the API. It will fill in the properties based on the suplied order, and the user bsn.
        /// For the move request we add the person as an property as an exception.
        /// The target organization of municipality DenBosch is used for now. This will be the organization that will handle the request.
        /// </summary>
        /// <param name="order"></param>
        /// <param name="bsn"></param>
        private Request CreateRequestData(Order order, string bsn)
        {
            var request = new Request
            {
                submitter = bsn,
                submitter_person = true,
                cases = new string[0],
                properties = new Dictionary<string, object>(),
                target_organization = TARGET_ORGANIZATION_DEN_BOSCH,
                request_type = _processBaseUri + "request_types/" + order.requestType
            };
            foreach (var question in order.data.Where(q => q.question != "END"))
            {
                if (question.value is string)
                {
                    request.properties.Add(question.key, question.value);
                }
                else
                {
                    var values = "";
                    if (question.value != null)
                    {
                        values = string.Join(", ", question.value);
                    }

                    if (question.key != null)
                    {
                        request.properties.Add(question.key, values);
                    }
                }
            }

            //TODO: Add some properties to verhuizen requestType on a fixed id for now. Will need to be discussed with Conduction.
            if (order.requestType == "9d76fb58-0711-4437-acc4-9f4d9d403cdf")
            {
                request.properties.Add("eigenaar", true);
                request.properties.Add("ingangsdatum", "01-01-2000");
                request.properties.Add("doorgeven_gegevens", false);
            }

            return request;
        }
    }

    // ReSharper disable InconsistentNaming
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
        public string target_organization { get; set; }
        public string submitter { get; set; }
        public bool submitter_person { get; set; }
        public Dictionary<string,object> properties { get; set; }
        public string[] cases { get; set; }
    }

    /*

    These will be needed when we will use the process API to generate the journeys.

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
    // ReSharper restore InconsistentNaming
}