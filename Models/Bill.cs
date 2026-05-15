using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WatchWebSite.Models
{
    public class Bill
    {
        //properties
        public int BillID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; }
    }
}