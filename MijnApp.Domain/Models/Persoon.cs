namespace MijnApp.Domain.Models
{
    public class Persoon
    {
        public string id { get; set; }
        public string burgerservicenummer { get; set; }
        public int? leeftijd { get; set; }
        //geheimhouding_persoonsgegevens
        //geslachtsaanduiding
        //leeftijd
        //datum_eerste_inschrijving_g_b_a
        //kiesrecht
        public Naam naam { get; set; }
        //nationaliteit
        public Geboorte geboorte { get; set; }
        //opschorting_bijhouding
        //overlijden
        public Verblijfplaats verblijfplaats { get; set; }
        //gezagsverhouding
        //verblijfstitel
        //ouders
        //kinderen
        //partners
        public Partner[] partners { get; set; }
        public Ouder[] ouders { get; set; }
        public Kind[] kinderen { get; set; }
    }

    public class PersoonV2
    {
        public string id { get; set; }
        public string burgerservicenummer { get; set; }
        public int? leeftijd { get; set; }
        //geheimhouding_persoonsgegevens
        //geslachtsaanduiding
        //leeftijd
        //datum_eerste_inschrijving_g_b_a
        //kiesrecht
        public Naam naam { get; set; }
        //nationaliteit
        //public Geboorte geboorte { get; set; }
        //opschorting_bijhouding
        //overlijden
        public Verblijfplaats verblijfplaats { get; set; }
        //gezagsverhouding
        //verblijfstitel
        //ouders
        //kinderen
        //partners
    }

    public class Partner
    {
        public string bsn { get; set; }
    }

    public class Ouder
    {
        public string bsn { get; set; }
    }

    public class Kind
    {
        public string bsn { get; set; }
    }
}