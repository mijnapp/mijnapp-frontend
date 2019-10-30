using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace MijnApp_Frontend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
        } 

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
                ConfigureFrontend();
            }
            app.UseHttpsRedirection();

            app.UseDefaultFiles();
            app.UseStatusCodePages(HandleStatusCodePages);

            app.UseStaticFiles();
        }


        private Task HandleStatusCodePages(StatusCodeContext arg)
        {
            arg.HttpContext.Request.Path = "/index.html";

            return Task.FromResult(0);
        }


        private void ConfigureFrontend()
        {
            const string configFileLocation = @"wwwroot/config/config.json";

            var pathToConfigFile = Path.Combine(Environment.CurrentDirectory, configFileLocation);

            if (File.Exists(pathToConfigFile))
            {
                var sectionSafeToSend = Configuration.GetSection("PublicSettings");

                var configAsString = "{";
                foreach (var child in sectionSafeToSend.GetChildren())
                {
                    configAsString += Environment.NewLine + $@"  ""{child.Key}"": ""{child.Value}"",";
                }
                configAsString = configAsString.Substring(0, configAsString.Length - 1);
                configAsString += Environment.NewLine + "}";

                var configFile = File.CreateText(pathToConfigFile);
                configFile.Write(configAsString);
                configFile.Close();
            }
        }
    }
}
