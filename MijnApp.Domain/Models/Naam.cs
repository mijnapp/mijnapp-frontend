namespace MijnApp.Domain.Models
{
    public class Naam
    {
        public string id { get; set; }
        public string geslachtsnaam { get; set; }
        public string voorletters { get; set; }
        public string voornamen { get; set; }
        public string voorvoegsel { get; set; }

        public string volledigenaam => string.IsNullOrWhiteSpace(voorvoegsel)
            ? $"{voornamen} {geslachtsnaam}"
            : $"{voornamen} {voorvoegsel} {geslachtsnaam}";
    }
}
