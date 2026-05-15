using System;
using System.Collections.Generic;
using System.Configuration; // Reads connection string from Web.config
using System.Data.SqlClient; // SQL Server database access
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WatchWebSite.Models;

namespace WatchWebSite.Controllers
{
    // API Controller for User Type operations
    public class TypeController : ApiController
    {
        // Database connection string
        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;

        // GET: Retrieve all user types
        [HttpGet]
        public List<UserType> GetUserType()
        {
            // List to store user types
            List<UserType> cat = new List<UserType>();

            using (SqlConnection con = new SqlConnection(str))
            {
                // Query to fetch all user types
                string query = @"Select * from UserType";

                SqlCommand cmd = new SqlCommand(query, con);

                con.Open(); // Open database connection

                SqlDataReader rdr = cmd.ExecuteReader();

                // Read each record from result set
                while (rdr.Read())
                {
                    // Create new UserType object
                    UserType u = new UserType();

                    // Map database fields to model properties
                    u.TypeID = Convert.ToInt32(rdr["TypeID"]);
                    u.TypeName = rdr["TypeName"].ToString();

                    // Add to list
                    cat.Add(u);
                }
            }

            // Return list of user types
            return cat;
        }
    }
}