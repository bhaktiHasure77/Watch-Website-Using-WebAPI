using System;
using System.Collections.Generic;
using System.Configuration; // Used to fetch connection string from Web.config
using System.Data.SqlClient; // Provides SQL Server database connectivity
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WatchWebSite.Models;

namespace WatchWebSite.Controllers
{
    // API Controller for Brand-related operations
    public class BrandController : ApiController
    {
        // Database connection string from configuration file
        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;

        // GET: Retrieve all brands
        [HttpGet]
        public List<Brand> GetBrand()
        {
            // List to store brand records
            List<Brand> brand = new List<Brand>();

            using (SqlConnection con = new SqlConnection(str))
            {
                // SQL query to fetch all brand data
                string query = @"Select * from Brand";

                SqlCommand cmd = new SqlCommand(query, con);

                con.Open(); // Open database connection

                // Execute query and get data reader
                SqlDataReader rdr = cmd.ExecuteReader();

                // Read each record from result set
                while (rdr.Read())
                {
                    // Create new Brand object
                    Brand b = new Brand();

                    // database fields to model properties
                    b.BrandID = Convert.ToInt32(rdr["BrandId"]);
                    b.BrandName = rdr["BrandName"].ToString();

                    // Add brand to list
                    brand.Add(b);
                }
            }

            // Return list of brands
            return brand;
        }
    }
}