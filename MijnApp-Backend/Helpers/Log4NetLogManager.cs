using log4net;

namespace MijnApp_Backend.Helpers
{
    internal static class Log4NetLogManager
    {
        private const string DefaultRepositoryName = "log4net-default-repository";

        internal static ILog AuditLogger => LogManager.GetLogger(DefaultRepositoryName, "Audit");
        internal static ILog ErrorLogger => LogManager.GetLogger(DefaultRepositoryName, "Error");
    }
}
