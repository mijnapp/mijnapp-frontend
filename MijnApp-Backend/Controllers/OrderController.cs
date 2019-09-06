using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MijnApp_Backend.HttpClients;

namespace MijnApp_Backend.Controllers
{
    //[Authorize]
    public class OrderController : Controller
    {
        private readonly string _baseUri;
        private readonly IServiceClient _serviceClient;

        public OrderController(IConfiguration config, IServiceClient serviceClient)
        {
            _baseUri = config.GetValue<string>("Api:OrderUri");
            _serviceClient = serviceClient;
        }

        [HttpPost]        
        [Route("order")]
        public IActionResult Order(dynamic data)
        {
            return Ok();
        }
    }
}
