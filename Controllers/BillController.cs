using System;
using System.Collections.Generic;
using System.Configuration; // Reads connection string from Web.config
using System.Data.SqlClient; // SQL Server database operations
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WatchWebSite.Models;

namespace WatchWebSite.Controllers
{
    // API Controller for Bill operations
    public class BillController : ApiController
    {
        // Database connection string
        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;

        // GET: Retrieve all bills with user information
        [HttpGet]
        public List<Bill> GetBill()
        {
            List<Bill> bill = new List<Bill>();

            using (SqlConnection con = new SqlConnection(str))
            {
                // Join Bill and Users table to get user name
                string query = @"Select b.BillID, b.UserID, u.UserName 
                                 from Bill b 
                                 INNER JOIN Users u 
                                 ON b.UserID = u.UserID";

                SqlCommand cmd = new SqlCommand(query, con);

                con.Open(); // Open database connection

                SqlDataReader rdr = cmd.ExecuteReader();

                // Read each record from result set
                while (rdr.Read())
                {
                    Bill b = new Bill();

                    // Map database columns to model properties
                    b.BillID = Convert.ToInt32(rdr["BillID"]);
                    b.UserID = Convert.ToInt32(rdr["UserID"]);

                    // NOTE: There is a bug here — it should be u.UserName, not UserID
                    b.UserName = rdr["UserName"].ToString();

                    bill.Add(b);
                }
            }

            return bill;
        }

        // POST: Create a new bill and return generated BillID
        [HttpPost]
        public int InsertBill(Bill b)
        {
            int billId = 0;

            using (SqlConnection con = new SqlConnection(str))
            {
                // Insert new bill with UserID
                string query = @"Insert Into Bill(UserID) values(@uid)";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@uid", b.UserID);

                con.Open();

                int row = cmd.ExecuteNonQuery();

                // If insert successful, fetch latest BillID
                if (row > 0)
                {
                    string query2 = "Select MAX(BillID) From Bill";

                    cmd = new SqlCommand(query2, con);

                    billId = Convert.ToInt32(cmd.ExecuteScalar().ToString());
                }
            }

            return billId;
        }
    }
}