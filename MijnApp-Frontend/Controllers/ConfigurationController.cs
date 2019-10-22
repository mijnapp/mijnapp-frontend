using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace MijnApp_Frontend.Controllers
{
    public class ConfigurationController : Controller
    {
        private readonly IConfiguration _configuration;

        public ConfigurationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route(nameof(GetConfiguration))]
        public IActionResult GetConfiguration()
        {
            var sectionSafeToSend = _configuration.GetSection("PublicSettings");
            var dictionary = sectionSafeToSend.GetChildren().ToDictionary(k => k.Key, v => v.Value);
            return Json(dictionary);
        }
    }
}
