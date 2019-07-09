using System;
using Newtonsoft.Json;

namespace MijnApp.Domain.Models
{
    public class Persoon
    {
        public Guid Id { get; set; }
        public string Bsn { get; set; }
        public string Voornamen { get; set; }
        public string VoorvoegselGeslachtsnaam { get; set; }
        public string Geslachtsnaam { get; set; }
        public string Geslacht { get; set; }
        [JsonConverter(typeof(DateConverter))]
        public DateTime? Geboortedatum { get; set; }
        public string Naamgebruik { get; set; }
        public string PartnerVoorvoegselGeslachtsnaam { get; set; }
        public string PartnerGeslachtsnaam { get; set; }
        public Adres Adres { get; set; }
    }
}