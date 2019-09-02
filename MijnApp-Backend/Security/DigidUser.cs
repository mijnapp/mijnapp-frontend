using System.Collections.Specialized;

namespace MijnApp_Backend.Security
{
    internal class DigidUser
    {
        public string Username { get; set; }

        public string Organization { get; set; }

        public long ExpiryTime { get; set; }

        internal DigidUser(NameValueCollection digidValues)
        {
            Username = digidValues["uid"];
            Organization = digidValues["organization"];
            ExpiryTime = long.Parse(digidValues["tgt_exp_time"]);
        }
    }
}
