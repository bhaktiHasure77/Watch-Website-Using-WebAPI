using System;
using System.Collections.Generic;
using System.Configuration; // Used to read connection string from Web.config
using System.Data.SqlClient; // Provides SQL Server database access
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WatchWebSite.Models;

namespace WatchWebSite.Controllers
{
    // API Controller for handling Category-related operations
    public class CategoryController : ApiController
    {
        // Get connection string from configuration file
        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;

        // GET: Retrieve all categories
        [HttpGet]
        public List<Category> GetCategory()
        {
            // List to store category data
            List<Category> cat = new List<Category>();

            // Create SQL connection
            using (SqlConnection con = new SqlConnection(str))
            {
                // SQL query to fetch all categories
                string query = @"Select * from Category";

                SqlCommand cmd = new SqlCommand(query, con);

                con.Open(); // Open database connection

                // Execute query and get data reader
                SqlDataReader rdr = cmd.ExecuteReader();

                // Loop through each record
                while (rdr.Read())
                {
                    // Create new Category object
                    Category c = new Category();

                    // Map database fields to object properties
                    c.CatID = Convert.ToInt32(rdr["categoryId"]);
                    c.CatName = rdr["categoryName"].ToString();

                    // Add category to list
                    cat.Add(c);
                }
            }

            // Return list of categories
            return cat;
        }
    }
}