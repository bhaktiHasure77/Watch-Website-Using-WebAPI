using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WatchWebSite.Models
{
    public class Users
    {
        //properties
        public int UserID { get; set; }
        public string Name{ get; set; }
        public string Email { get; set; }
        public string Pass { get; set; }
        public int TypeID { get; set; }
    }
}