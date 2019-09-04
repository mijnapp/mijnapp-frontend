using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MijnApp_Backend.Controllers
{
    //[Authorize]
    public class OrderController : Controller
    {
        [HttpPost]        
        [Route("order")]
        public IActionResult Order(dynamic data)
        {
            return Ok();
        }
    }
}
