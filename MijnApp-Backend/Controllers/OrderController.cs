﻿using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MijnApp_Backend.HttpClients;
using MijnApp_Backend.Security;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using MijnApp_Backend.Services;

namespace MijnApp_Backend.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        private readonly JwtTokenProvider _jwtTokenProvider;
        private readonly PersonService _personService;
        private readonly string _baseUri;
        private readonly string _orderTypeBaseUri;
        private readonly string _webResourceBaseUri;
        private readonly string _addressBaseUri;
        private readonly IServiceClient _serviceClient;
        private const string PostRequest = "{0}requests";
        private const string GetRequest = "{0}requests?submitters.brp={1}";
        private const string GetAddressOnBagId = "{0}adressen?bagid={1}";
        private const string TargetOrganizationDenBosch = "1709124";
        private const string OrganizationIdDenBosch = "4f387d0e-a2e5-44c0-9902-c31b63a8ee36";
        private const string MovePersonRequestTypeId = "9d76fb58-0711-4437-acc4-9f4d9d403cdf";
        private Dictionary<string, string> _cachedPersonsNames;

        public OrderController(IConfiguration config, IServiceClient serviceClient)
        {
            _baseUri = config.GetValue<string>("Api:OrderUri");
            _orderTypeBaseUri = config.GetValue<string>("Api:OrderTypeUri");
            _webResourceBaseUri = config.GetValue<string>("Api:WebResourceUri");
            _addressBaseUri = config.GetValue<string>("Api:AddressUri");
            _serviceClient = serviceClient;
            _serviceClient.SetApiKey(config.GetValue<string>("Api:OrderApiKey"));
            _jwtTokenProvider = new JwtTokenProvider(config);
            _personService = new PersonService(_jwtTokenProvider, serviceClient, config);
            _cachedPersonsNames = new Dictionary<string, string>();
        }

        [HttpGet]
        [Route("orders")]
        public async Task<IActionResult> GetOrders()
        {
            var bsn = _jwtTokenProvider.GetBsnFromClaims(HttpContext.User);
            var submitterUrl = "https://brp.dev.mijnapp.zaakonline.nl/ingeschrevenpersonen/uuid/1edd146d-25c5-439e-8c04-8d6bff997ab4";
            var url = string.Format(GetRequest, _baseUri, submitterUrl);
            var response = await _serviceClient.GetAsync(url);
            var result = await response.Content.ReadAsStringAsync();
            var allRequestForSubmitter = JsonConvert.DeserializeObject<List<Request>>(result);

            //Filter request on submitter (TODO: When the conduction API fixes the filtering on the API side, this wont be necessary)
            var requestFromBsn = new List<Request>();
            foreach (var request in allRequestForSubmitter)
            {
                //Add the correct data for the request(based on the requestType?)
                await AddRequestDataFromType(request);
                requestFromBsn.Add(request);
            }

            //Order request on create date. Last one on top
            var orderedRequest = requestFromBsn.OrderByDescending(r => r.dateCreated).ToList();
            return Json(orderedRequest);
        }

        private async Task<Request> AddRequestDataFromType(Request request)
        {
            //TODO get name from _orderTypeBaseUri
            if (request.requestType == _orderTypeBaseUri + "request_types/" + MovePersonRequestTypeId)
            {
                request.request_type_name = "Verhuizen";

                //find the wie property
                string meeVerhuizersString = request.properties["wie"] as string;
                var meeVerhuizers = meeVerhuizersString.Split(",");
                var personNames = new List<string>();
                foreach (var meeVerhuizer in meeVerhuizers)
                {
                    var guid = meeVerhuizer.Trim();
                    if (_cachedPersonsNames.ContainsKey(guid))
                    {
                        personNames.Add(_cachedPersonsNames[guid]);
                    }
                    else
                    {
                        var person = await _personService.GetPersonFromApiFromGuid(guid);
                        personNames.Add(person.naam.aanschrijfwijze);
                        _cachedPersonsNames[guid] = person.naam.aanschrijfwijze;
                    }
                }
                request.properties.Add("wie_name", string.Join(", ",personNames));

                string adressBagIdString = request.properties["adress"] as string;
                var addressResponse = await _serviceClient.GetAsync(string.Format(GetAddressOnBagId, _addressBaseUri, adressBagIdString));
                var addressResult = await addressResponse.Content.ReadAsStringAsync();
                var address = JsonConvert.DeserializeObject<Address>(addressResult);
                var addressFormat = "{0} {1}{2}, {3} {4}";
                var adressString = string.Format(addressFormat, address.straat, address.huisnummer,
                    address.huisnummertoevoeging, address.postcode, address.woonplaats);
                request.properties.Add("adress_description", adressString);
            }

            return request;
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
            //Gebruik url ipv bsn in submitter (DEV: /ingeschrevenpersonen/uuid/1edd146d-25c5-439e-8c04-8d6bff997ab4, PROD: /ingeschrevenpersonen/uuid/0282b6eb-2bf2-4544-9242-511501d73be4)
            var submitterUrl = "https://brp.dev.mijnapp.zaakonline.nl/ingeschrevenpersonen/uuid/1edd146d-25c5-439e-8c04-8d6bff997ab4";
            var submitter = new Submitter
            {
                brp = submitterUrl,
                person = "",
            };
            //var submitter = new Submitter { person = "680508429" }; //Added request for different bsn.
            var organization = new Organization
            {
                id = OrganizationIdDenBosch,
                rsin = TargetOrganizationDenBosch
            };

            var request = new Request
            {
                submitters = new [] { submitter },
                request_cases = new string[0],
                properties = new Dictionary<string, object>(),
                organization = _webResourceBaseUri  + "organizations/" + organization.id,
                requestType = _orderTypeBaseUri + "request_types/" + order.requestType,
                status = "complete",
            };
            foreach (var question in order.data.Where(q => q.question != "END"))
            {
                if (question.key is string)
                {
                    //Normal question
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
                else
                {
                    //Multiple keys/values in question
                    var index = 0;
                    foreach (string key in question.key)
                    {
                        var value = question.value[index].ToString();
                        request.properties.Add(key, value);
                        index++;
                    }
                }
            }

            //TODO: Add some properties to verhuizen requestType on a fixed id for now. Will need to be discussed with Conduction.
            if (order.requestType == MovePersonRequestTypeId)
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
        public dynamic key { get; set; }
        public dynamic value { get; set; }
        public string keyTitle { get; set; }
        public dynamic valueTitle { get; set; }
    }

    internal class Request
    {
        //Properties used when sending & retrieving a request
        public string requestType { get; set; }
        public string organization { get; set; }
        public Submitter[] submitters { get; set; }
        public Dictionary<string,object> properties { get; set; }
        public string[] request_cases { get; set; }

        //Properties used when retrieving requests
        public string reference { get; set; }
        public string status { get; set; }
        public DateTime dateCreated { get; set; }
        public DateTime dateModified { get; set; }

        //Calculated properties 
        public string request_type_name { get; set; }

        //Properties we dont know?
        //"cases": [],
        //"parent": null,
        //"children": [],
        //"confidential": null,
        //"current_stage": null,
        //"date_submitted": null, Seems to be always null?
    }

    internal class Organization
    {
        public string id { get; set; }
        public string rsin { get; set; }
    }

    internal class Submitter
    {
        public string brp { get; set; }
        public string person { get; set; }
    }

    public class Address
    {
        public string id { get; set; }
        public string type { get; set; }
        public string huisnummer { get; set; }
        public string postcode { get; set; }
        public string huisnummertoevoeging { get; set; }
        public string straat { get; set; }
        public string woonplaats { get; set; }

        //public string oppervlakte { get; set; }
        //public string woonplaats_nummer { get; set; }
        //public string gemeente_nummer { get; set; }
        //public string gemeente_rsin { get; set; }
        //public string status_nummeraanduiding { get; set; }
        //public string status_verblijfsobject { get; set; }
        //public string status_openbare_ruimte { get; set; }
        //public string status_woonplaats { get; set; }
        //public string _links { get; set; }
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