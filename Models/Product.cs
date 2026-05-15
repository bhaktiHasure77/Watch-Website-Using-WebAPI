using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WatchWebSite.Models
{
    public class Product
    {
        //properties
        public int ProdID { get; set; }
        public string Name { get; set; }
        public int Qty { get; set; }
        public string Image { get; set; }
        public string DSC { get; set; }
        public int Price { get; set; }       
        public int CatID { get; set; }
        public int BrandID { get; set; }

    }
}