using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WatchWebSite.Models
{
    public class Cart
    {
        //properties
        public int CartID { get; set; }
        public int UserID { get; set; }
        public int ProdID { get; set; }
        public int Qty { get; set; }
        public int Amt { get; set; }
        public int BillID { get; set; }
    }
}