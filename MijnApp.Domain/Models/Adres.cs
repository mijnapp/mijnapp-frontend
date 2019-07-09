using System;

namespace MijnApp.Domain.Models
{
    public class Adres
    {
        public Guid Id { get; set; }
        public string BagIdentificatie { get; set; }
        public string Woonplaats { get; set; }
        public string OpenbareRuimteNaam { get; set; }
        public string Postcode { get; set; }
        public int? Huisnummer { get; set; }
        public string Huisletter { get; set; }
        public string HuisnummerToevoeging { get; set; }
    }
}