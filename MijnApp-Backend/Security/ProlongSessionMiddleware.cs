using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using MijnApp_Backend.HttpClients;

namespace MijnApp_Backend.Security
{
    internal class ProlongSessionMiddleware
    {
        private readonly RequestDelegate _next;

        public ProlongSessionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IConfiguration configuration, IDigidClient digidClient)
        {
            string newJwtToken = ProlongSessionAndCreateNewJwtToken(context.User, configuration, digidClient);

            if (string.IsNullOrEmpty(newJwtToken))
            {
                await _next(context);
                return;
            }

            // Store the "pre-modified" response stream.
            var existingBody = context.Response.Body;

            using (var newBody = new MemoryStream())
            {
                // We set the response body to our stream so we can read after the chain of middle wares have been called.
                context.Response.Body = newBody;

                await _next(context);

                // Reset the body so nothing from the latter middle wares goes to the output.
                context.Response.Body = new MemoryStream();
                newBody.Seek(0, SeekOrigin.Begin);

                //Get the original content
                var originalContent = new StreamReader(newBody).ReadToEnd();

                //Remove the last "}
                var newContent = originalContent.Substring(0, originalContent.Length - 2);

                //Add the jwtToken
                newContent += $",\"jwtToken\":\"{newJwtToken}\"";

                //And reposition the last "}
                newContent += "}\"";

                //Set back the existing stream
                context.Response.Body = existingBody;

                // Send our modified content to the response body.
                await context.Response.WriteAsync(newContent);
            }
        }

        private string ProlongSessionAndCreateNewJwtToken(ClaimsPrincipal currentUser, IConfiguration configuration, IDigidClient digidClient)
        {
            string jwtToken = string.Empty;

            if (currentUser.HasClaim(c => c.Type == JwtTokenProvider.JwtOriginalIdp))
            {
                var signInProviderString = currentUser.Claims.First(c => c.Type == JwtTokenProvider.JwtOriginalIdp).Value;

                var signInProvider = Enum.Parse<SignInProvider>(signInProviderString);

                switch (signInProvider)
                {
                    case SignInProvider.DigidCgi:
                        jwtToken = ProlongSessionDigidCgiAndCreateJwtToken(currentUser, configuration, digidClient);
                        break;
                }
            }

            return jwtToken;
        }

        private string ProlongSessionDigidCgiAndCreateJwtToken(ClaimsPrincipal currentUser, IConfiguration configuration, IDigidClient digidClient)
        {
            var digidCgi = new DigidCgi(configuration, digidClient);

            digidCgi.ProlongSession(currentUser);

            var jwtTokenProvider = new JwtTokenProvider(configuration);

            return jwtTokenProvider.ProlongJwtToken(currentUser, SignInProvider.DigidCgi);
        }
    }

    internal static class ProlongSessionMiddlewareExtensions
    {
        internal static IApplicationBuilder UseProlongSession(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ProlongSessionMiddleware>();
        }
    }
}
