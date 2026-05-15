using System;
using System.Collections.Generic;
using System.Configuration; // Used to read connection string from Web.config
using System.Data.SqlClient; // SQL Server database operations
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WatchWebSite.Models;

namespace WatchWebSite.Controllers
{
    // API Controller for Cart operations
    public class CartController : ApiController
    {
        // Database connection string
        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;

        // GET: Retrieve cart items with user details
        [HttpGet]
        public List<Cart> GetUsers()
        {
            List<Cart> cart = new List<Cart>();

            using (SqlConnection con = new SqlConnection(str))
            {
                // Join Cart and Users table to get combined data
                string query = @"Select * from Cart c 
                                 Inner Join Users u 
                                 on c.UserID = u.UserID";

                SqlCommand cmd = new SqlCommand(query, con);

                con.Open(); // Open DB connection

                SqlDataReader rdr = cmd.ExecuteReader();

                // Read each record from result set
                while (rdr.Read())
                {
                    Cart c = new Cart();

                    // Map database columns to Cart model
                    c.CartID = Convert.ToInt32(rdr["CartID"]);
                    c.UserID = Convert.ToInt32(rdr["UserID"]);
                    c.ProdID = Convert.ToInt32(rdr["ProdID"]);
                    c.Qty = Convert.ToInt32(rdr["CartQty"]);
                    c.Amt = Convert.ToInt32(rdr["Price"]);

                    cart.Add(c);
                }
            }

            return cart;
        }

        // POST: Add item to cart
        [HttpPost]
        public string InsertCart(Cart c)
        {
            string res = " ";

            using (SqlConnection con = new SqlConnection(str))
            {
                // Insert query for cart
                string query = @"Insert Into Cart(UserID, ProdID, CartQty, Price) 
                                 values(@uid, @pid, @qty, @price)";

                SqlCommand cmd = new SqlCommand(query, con);

                // Add parameters to avoid SQL injection
                cmd.Parameters.AddWithValue("@uid", c.UserID);
                cmd.Parameters.AddWithValue("@pid", c.ProdID);
                cmd.Parameters.AddWithValue("@qty", c.Qty);
                cmd.Parameters.AddWithValue("@price", c.Amt);

                con.Open();

                // Execute insert
                int row = cmd.ExecuteNonQuery();

                // Check success
                if (row > 0)
                {
                    res = "Cart Added!!";
                }
                else
                {
                    res = "Error Inserting Cart!!";
                }
            }

            return res;
        }

        // PUT: Update cart item
        [HttpPut]
        public string UpdateCart(Cart c)
        {
            using (SqlConnection con = new SqlConnection(str))
            {
                // Update query (NOTE: currently updates based only on ProdID)
                string query = @"Update Cart Set 
                                UserID=@uid,
                                ProdID=@pid,
                                CartQty=@qty,
                                Price=@price 
                                Where ProdID=@pid";

                SqlCommand cmd = new SqlCommand(query, con);

                // Add parameters
                cmd.Parameters.AddWithValue("@uid", c.UserID);
                cmd.Parameters.AddWithValue("@pid", c.ProdID);
                cmd.Parameters.AddWithValue("@qty", c.Qty);
                cmd.Parameters.AddWithValue("@price", c.Amt);

                con.Open();

                // Execute update
                cmd.ExecuteNonQuery();
            }

            return "Cart Updated Successfully!!";
        }

        // DELETE: Remove item from cart by product ID
        [HttpDelete]
        public string DeleteCart(int id)
        {
            using (SqlConnection con = new SqlConnection(str))
            {
                string query = "Delete From Cart Where ProdID=@id";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@id", id);

                con.Open();

                cmd.ExecuteNonQuery();
            }

            return "Cart Deleted Succesfully!!";
        }
    }
}