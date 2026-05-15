using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WatchWebSite.Models
{
    public class BillDetails
    {
        //properties
        public int BillDID { get; set; }
        public int BillID { get; set; }
        public int ProdID { get; set; }
        public int Qty { get; set; }
        public int Amt { get; set; }
        public string Name { get; set; }
    }
}