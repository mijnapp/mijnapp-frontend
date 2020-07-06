using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using MijnApp_Backend.Helpers;
using MijnApp_Backend.HttpClients;
using MijnApp_Backend.Security;

namespace MijnApp_Backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = Configuration["Jwt:Issuer"],
                        ValidAudience = Configuration["Jwt:Issuer"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"])),
                        ClockSkew = new TimeSpan(0,1,0)
                    };
                });

            services.AddHttpContextAccessor();
            services.AddHttpClient<IServiceClient, ServiceClient>(ConfigureServiceClient).ConfigurePrimaryHttpMessageHandler(ConfigureServiceWithCertificate);
            services.AddHttpClient<IDigidClient, DigidClient>().ConfigurePrimaryHttpMessageHandler(ConfigureServiceWithCertificate);

            services.AddCors();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
        }

        private HttpMessageHandler ConfigureServiceWithCertificate(IServiceProvider arg)
        {
            var certPath = Configuration["DigidCgi:CertificatePath"];
            var certPass = Configuration["DigidCgi:CertificatePassword"];
            // Create a collection object and populate it using the PFX file
            X509Certificate2Collection collection = new X509Certificate2Collection();
            collection.Import(certPath, certPass, X509KeyStorageFlags.EphemeralKeySet);

            var httpClientHandler = new HttpClientHandler();
            httpClientHandler.ClientCertificates.Add(collection[0]);
            httpClientHandler.ClientCertificateOptions = ClientCertificateOption.Manual;

            return httpClientHandler;
        }

        private void ConfigureServiceClient(IServiceProvider serviceProvider, HttpClient httpClient)
        {
            var httpContextAccessor = serviceProvider.GetService<IHttpContextAccessor>();
            var correlationId = JwtTokenProvider.GetCorrelationIdForLogging(httpContextAccessor.HttpContext.User);
            httpClient.DefaultRequestHeaders.Add("X-NLX-Logrecord-ID", correlationId);
            httpClient.DefaultRequestHeaders.Accept.Clear();
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var frontEndHeaders = httpContextAccessor.HttpContext.Request.Headers;
            if (frontEndHeaders.ContainsKey("X-NLX-Request-Process-Id"))
            {
                var processId = frontEndHeaders["X-NLX-Request-Process-Id"].ToString();
                httpClient.DefaultRequestHeaders.Add("X-NLX-Request-Process-Id", processId);
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddLog4Net(Configuration["Log4NetConfigFile:Name"]);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            //NWebSec security headers.
            app.UseXfo(options => options.Deny());
            app.UseReferrerPolicy(opts => opts.SameOrigin());
            app.UseXContentTypeOptions(); //add "nosniff"

            app.UseRouting();

            var origins = Configuration.GetValue<string>("Origins").Split(';');
            app.UseCors(builder =>
            {
                builder.WithOrigins(origins);
                builder.AllowAnyHeader();
                builder.AllowAnyMethod();
                builder.AllowCredentials();
            });

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseExceptionLogging();
            app.UseRequestResponseLogging();

            //Comment this out for now, because we can't prolong the session since we are completely stateless (session-less)
            //and don't have the necessary data to prolong the session.
            //app.UseProlongSession(); 
            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
            });
        }
    }
}
