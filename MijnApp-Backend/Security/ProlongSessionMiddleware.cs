using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace MijnApp_Backend.Security
{
    internal class ProlongSessionMiddleware
    {
        private readonly RequestDelegate _next;

        public ProlongSessionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IConfiguration configuration)
        {
            ProlongSession(context.User, configuration);

            // Call the next delegate/middleware in the pipeline
            await _next(context);

            //TODO - we should do something with the renewed session in the existing JWT token
        }

        private void ProlongSession(ClaimsPrincipal currentUser, IConfiguration configuration)
        {
            if (currentUser.HasClaim(c => c.Type == JwtTokenProvider.JwtOriginalIdp))
            {
                var signInProviderString = currentUser.Claims.First(c => c.Type == JwtTokenProvider.JwtOriginalIdp).Value;

                var signInProvider = Enum.Parse<SignInProvider>(signInProviderString);

                switch (signInProvider)
                {
                    case SignInProvider.DigidCgi:
                        ProlongSessionDigidCgi(currentUser, configuration);
                        break;
                }
            }
        }

        private void ProlongSessionDigidCgi(ClaimsPrincipal currentUser, IConfiguration configuration)
        {
            var digidCgi = new DigidCgi(configuration);

            digidCgi.ProlongSession(currentUser);
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
