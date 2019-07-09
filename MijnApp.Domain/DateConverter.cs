using Newtonsoft.Json.Converters;

namespace MijnApp.Domain
{
    public class DateConverter : IsoDateTimeConverter
    {
        public DateConverter()
        {
            DateTimeFormat = "yyyy-MM-dd";
        }
    }
}