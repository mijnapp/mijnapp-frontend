using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace MijnApp_Backend.Controllers
{
    //[Authorize]
    public class OrderController : Controller
    {
        private readonly string BaseUri = "";

        public OrderController([FromServices] IConfiguration config)
        {
            BaseUri = config.GetValue<string>("Api:OrderUri");
        }

        [HttpPost]        
        [Route("order")]
        public IActionResult Order(dynamic data)
        {
            return Ok();
        }
    }
}
