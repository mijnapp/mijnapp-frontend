using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using MijnApp_Backend.Security;

namespace MijnApp_Backend.Helpers
{
    internal class RequestResponseLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestResponseLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var request = FormatRequest(context.Request);
            var correlationId = JwtTokenProvider.GetCorrelationIdForLogging(context.User);

            await _next(context);

            var response = FormatResponse(context.Response);

            if (context.Response.StatusCode.Equals(200)) { 
                Log4NetLogManager.AuditLogger.Info($"{Environment.NewLine}Request: {request}{Environment.NewLine}Response:{response}", correlationId);
            }
            else
            {
                Log4NetLogManager.AuditLogger.Warn($"{Environment.NewLine}Request: {request}{Environment.NewLine}Response:{response}", correlationId);
            }
        }

        private string FormatRequest(HttpRequest request)
        {
            return $"{request.Scheme} {request.Host}{request.Path} {request.QueryString}";
        }

        private string FormatResponse(HttpResponse response)
        {
            //Return only the status code (e.g. 200, 404, 401, etc.)
            return $"{response.StatusCode}";
        }
    }
    internal static class RequestResponseLoggingMiddlewareExtensions
    {
        internal static IApplicationBuilder UseRequestResponseLogging(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RequestResponseLoggingMiddleware>();
        }
    }
}
