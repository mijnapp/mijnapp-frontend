using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace MijnApp_Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
#if DEBUG
                    var userSecretsId = "320e50fc-0267-417b-965b-f4c06031b254";
                    var path = $@"C:\UserSecrets\{userSecretsId}\secrets.json";
                    if (System.IO.File.Exists(path)) { 
                        config.AddJsonFile(path);
                    }
#endif
                })
                .UseKestrel(options => options.AddServerHeader = false)
                .UseIIS()
                .UseStartup<Startup>();
    }
}
