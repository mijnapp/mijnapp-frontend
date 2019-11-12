using System;
using System.Collections.Generic;
using System.Text;

namespace MijnApp.Domain.Models
{
    public class Geboorte
    {
        public Datum datum { get; set; }
    }

    public class Datum
    {
        public string date { get; set; }
    }
}
