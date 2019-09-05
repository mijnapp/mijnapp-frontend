using System.Collections.Specialized;

namespace MijnApp_Backend.Security
{
    internal class DigidUser
    {
        public string Bsn { get; set; }

        public string Organization { get; set; }

        public long ExpiryTime { get; set; }

        internal DigidUser(NameValueCollection digidValues)
        {
            Bsn = digidValues[DigidConstants.Uid];
            Organization = digidValues[DigidConstants.Organization];
            ExpiryTime = long.Parse(digidValues[DigidConstants.TgtExpTime]);
            //HandleAttributes(digidValues[DigidConstants.Attributes]);
        }

        //private void HandleAttributes(string base64EncodedAttributes)
        //{
        //    try
        //    {
        //        var decodedBytes = Convert.FromBase64String(base64EncodedAttributes);
        //        var decodedAttributesString = Encoding.UTF8.GetString(decodedBytes);

        //        var decodedAttributes = HttpUtility.ParseQueryString(decodedAttributesString);
        //        var samlAttributeToken = decodedAttributes[DigidConstants.SamlAttributeToken];
        //        var samlAttributesBytes = Convert.FromBase64String(samlAttributeToken);
                
        //        var samlAttributesString = Encoding.UTF8.GetString(samlAttributesBytes);
        //    }
        //    catch (Exception ex)
        //    {

        //        string s = "";
        //    }
        //}
    }
}
