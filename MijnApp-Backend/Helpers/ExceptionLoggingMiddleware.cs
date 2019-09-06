using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using MijnApp_Backend.Security;

namespace MijnApp_Backend.Helpers
{
    internal class ExceptionLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        public ExceptionLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                var calledUrl = context.Request.GetDisplayUrl();
                var correlationId = JwtTokenProvider.GetCorrelationIdForLogging(context.User);
                Log4NetLogManager.ErrorLogger.Error($"Onverwachte fout bij het opvragen van URL '{calledUrl}'", correlationId, exception);

                throw;
            }
        }

    }

    internal static class ExceptionLoggingMiddlewareExtensions
    {
        internal static IApplicationBuilder UseExceptionLogging(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionLoggingMiddleware>();
        }
    }
}
