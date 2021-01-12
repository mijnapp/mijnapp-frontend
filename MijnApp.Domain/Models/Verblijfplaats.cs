namespace MijnApp.Domain.Models
{
    public class Verblijfplaats
    {
        public string bag_id { get; set; }
        public string huisletter { get; set; }
        public string huisnummer { get; set; }
        public string huisnummertoevoeging { get; set; }
        public string postcode { get; set; }
        public string straatnaam { get; set; }
        public string woonplaatsnaam { get; set; }

        public string AddressString()
        {
            if(postcode != null)
            {
                return postcode.Replace(" ", "") + " " + straatnaam + " " + huisnummer + " " + huisnummertoevoeging + " " + huisletter;
            }            
            return postcode + " " + straatnaam + " " + huisnummer + " " + huisnummertoevoeging + " " + huisletter;
        }
    }
}
