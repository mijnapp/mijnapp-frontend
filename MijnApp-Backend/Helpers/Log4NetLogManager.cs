using System;
using log4net;

namespace MijnApp_Backend.Helpers
{
    internal static class Log4NetLogManager
    {
        private const string DefaultRepositoryName = "log4net-default-repository";

        internal static ILog AuditLogger => LogManager.GetLogger(DefaultRepositoryName, "Audit");
        internal static ILog ErrorLogger => LogManager.GetLogger(DefaultRepositoryName, "Error");

        internal static void Error(this ILog logger, string message, string correlationId, Exception exception)
        {
            logger.Error($"[{correlationId}] - {message}", exception);
        }

        internal static void Warn(this ILog logger, string message, string correlationId)
        {
            logger.Warn($"[{correlationId}] - {message}");
        }

        internal static void Info(this ILog logger, string message, string correlationId)
        {
            logger.Info($"[{correlationId}] - {message}");
        }
    }
}
