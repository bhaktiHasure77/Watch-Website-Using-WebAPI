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
    // API Controller for handling Product-related operations
    public class ProductController : ApiController
    {
        // Fetch connection string from configuration file
        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;

        // GET: Retrieve all products
        [HttpGet]
        public List<Product> GetProduct()
        {
            // List to store products
            List<Product> prod = new List<Product>();

            // Establish SQL connection
            using (SqlConnection con = new SqlConnection(str))
            {
                // SQL query to fetch product details along with category
                string query = @"Select p.*,c.categoryId 
                                 from Product p 
                                 INNER JOIN Category c 
                                 ON p.categoryId= c.categoryId";

                SqlCommand cmd = new SqlCommand(query, con);

                con.Open(); // Open database connection

                // Execute query and read data
                SqlDataReader rdr = cmd.ExecuteReader();

                // Loop through each record
                while (rdr.Read())
                {
                    // Create new Product object
                    Product p = new Product();

                    // Map database fields to object properties
                    p.ProdID = Convert.ToInt32(rdr["ProdID"]);
                    p.Name = rdr["ProdName"].ToString();
                    p.Price = Convert.ToInt32(rdr["ProdPrice"]);
                    p.Image = rdr["Img"].ToString();
                    p.DSC = rdr["ProdDsc"].ToString();
                    p.Qty = Convert.ToInt32(rdr["Qty"]);
                    p.CatID = Convert.ToInt32(rdr["categoryId"]);
                    p.BrandID = Convert.ToInt32(rdr["BrandId"]);

                    // Add product to list
                    prod.Add(p);
                }
            }

            // Return list of products
            return prod;
        }

        // POST: Insert a new product
        [HttpPost]
        public string InsertProduct(Product p)
        {
            string res = " "; // Result message

            using (SqlConnection con = new SqlConnection(str))
            {
                // SQL query for inserting product
                string query = @"Insert Into Product
                                (ProdName, ProdPrice, Img, ProdDsc, Qty, categoryId, BrandId)
                                values(@name,@price,@img,@dsc,@qty,@cid,@bid)";

                SqlCommand cmd = new SqlCommand(query, con);

                // Add parameters to prevent SQL injection
                cmd.Parameters.AddWithValue("@name", p.Name);
                cmd.Parameters.AddWithValue("@price", p.Price);
                cmd.Parameters.AddWithValue("@img", p.Image);
                cmd.Parameters.AddWithValue("@dsc", p.DSC);
                cmd.Parameters.AddWithValue("@qty", p.Qty);
                cmd.Parameters.AddWithValue("@cid", p.CatID);
                cmd.Parameters.AddWithValue("@bid", p.BrandID);

                con.Open();

                // Execute insert query
                int row = cmd.ExecuteNonQuery();

                // Check if insertion was successful
                if (row > 0)
                {
                    res = "Product Added!!";
                }
                else
                {
                    res = "Error Inserting Product!!";
                }
            }

            return res;
        }

        // PUT: Update existing product
        [HttpPut]
        public string UpdateProduct(Product p)
        {
            using (SqlConnection con = new SqlConnection(str))
            {
                // SQL query to update product details
                string query = @"Update Product Set 
                                Prodname=@name,
                                ProdPrice=@price,
                                Img=@img,
                                ProdDsc=@dsc,
                                Qty=@qty,
                                categoryId=@cid,
                                BrandId=@bid 
                                Where ProdID=@pid";

                SqlCommand cmd = new SqlCommand(query, con);

                // Add parameters
                cmd.Parameters.AddWithValue("@pid", p.ProdID);
                cmd.Parameters.AddWithValue("@name", p.Name);
                cmd.Parameters.AddWithValue("@price", p.Price);
                cmd.Parameters.AddWithValue("@img", p.Image);
                cmd.Parameters.AddWithValue("@dsc", p.DSC);
                cmd.Parameters.AddWithValue("@qty", p.Qty);
                cmd.Parameters.AddWithValue("@cid", p.CatID);
                cmd.Parameters.AddWithValue("@bid", p.BrandID);

                con.Open();

                // Execute update query
                cmd.ExecuteNonQuery();
            }

            return "User Updated Successfully!!"; // (Note: Message should ideally say "Product")
        }

        // DELETE: Remove a product by ID
        [HttpDelete]
        public string DeleteProduct(int id)
        {
            using (SqlConnection con = new SqlConnection(str))
            {
                // SQL query to delete product
                string query = "Delete From Product Where ProdID=@id";

                SqlCommand cmd = new SqlCommand(query, con);

                // Add parameter for product ID
                cmd.Parameters.AddWithValue("@id", id);

                con.Open();

                // Execute delete query
                cmd.ExecuteNonQuery();
            }

            return "Product Deleted Succesfully!!";
        }
    }
}