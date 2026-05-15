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
    // API Controller for Bill Details operations
    public class BillDetailsController : ApiController
    {
        // Database connection string
        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;

        // GET: Retrieve all bill details records
        [HttpGet]
        public List<BillDetails> GetBill()
        {
            // List to store bill details
            List<BillDetails> billD = new List<BillDetails>();

            using (SqlConnection con = new SqlConnection(str))
            {
                // Query to fetch all bill details
                string query = @"select bd.*,u.UserName from Bill b
                        inner join BillDetails bd on b.BillID=bd.BillID
                        inner join Users u on u.UserID=b.UserID";

                SqlCommand cmd = new SqlCommand(query, con);

                con.Open(); // Open DB connection

                SqlDataReader rdr = cmd.ExecuteReader();

                // Read each row from result set
                while (rdr.Read())
                {
                    // Create new BillDetails object for each row
                    BillDetails bd = new BillDetails();

                    // Map database columns to model properties
                    bd.BillDID = Convert.ToInt32(rdr["BillDetailsID"]);
                    bd.ProdID = Convert.ToInt32(rdr["ProdID"]);
                    bd.BillID = Convert.ToInt32(rdr["BillID"]);
                    bd.Qty = Convert.ToInt32(rdr["BillQTY"]);
                    bd.Amt = Convert.ToInt32(rdr["BillAmt"]);
                    bd.Name = rdr["UserName"].ToString();

                    // Add to list
                    billD.Add(bd);
                }
            }

            // Return list of bill details
            return billD;
        }

        // POST: Insert bill details for multiple cart items (generate bill)
        [HttpPost]
        public string InsertBillDetails(List<Cart> items)
        {
            string res = " ";

            using (SqlConnection con = new SqlConnection(str))
            {
                con.Open(); // Open connection once for batch insert

                // Loop through cart items and insert each as a bill detail
                foreach (var v in items)
                {
                    string query = @"INSERT INTO BillDetails 
                                    (BillID, ProdID, BillQty, BillAmt) 
                                    VALUES (@bid, @pid, @qty, @amt)";

                    SqlCommand cmd = new SqlCommand(query, con);

                    // Add parameters to prevent SQL injection
                    cmd.Parameters.AddWithValue("@bid", v.BillID);
                    cmd.Parameters.AddWithValue("@pid", v.ProdID);
                    cmd.Parameters.AddWithValue("@qty", v.Qty);
                    cmd.Parameters.AddWithValue("@amt", v.Amt);

                    // Execute insert for each item
                    cmd.ExecuteNonQuery();
                }

                // Final response after inserting all items
                res = "Bill Generated";
            }

            return res;
        }
    }
}