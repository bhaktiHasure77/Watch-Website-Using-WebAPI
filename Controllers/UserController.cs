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
    // API Controller for User-related operations
    public class UserController : ApiController
    {
        // Database connection string
        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;

        // GET: Retrieve all users with their user type details
        [HttpGet]
        public List<Users> GetUsers()
        {
            // List to store user data
            List<Users> users = new List<Users>();

            using (SqlConnection con = new SqlConnection(str))
            {
                // Join Users table with UserType table
                string query = @"Select u.UserID, u.UserName, u.UserEmail, u.UserPassword, u.TypeID, ut.TypeName 
                                 from Users u 
                                 INNER JOIN UserType ut 
                                 ON u.TypeID = ut.TypeID";

                SqlCommand cmd = new SqlCommand(query, con);

                con.Open(); // Open DB connection

                SqlDataReader rdr = cmd.ExecuteReader();

                // Read each record from result set
                while (rdr.Read())
                {
                    Users ud = new Users();

                    // Map database columns to model properties
                    ud.UserID = Convert.ToInt32(rdr["UserID"]);
                    ud.Name = rdr["UserName"].ToString();
                    ud.Email = rdr["UserEmail"].ToString();
                    ud.Pass = rdr["UserPassword"].ToString();
                    ud.TypeID = Convert.ToInt32(rdr["TypeID"]);

                    users.Add(ud);
                }
            }

            return users;
        }

        // POST: Insert a new user
        [HttpPost]
        public string InsertUser(Users ud)
        {
            string res = " ";

            using (SqlConnection con = new SqlConnection(str))
            {
                // SQL query to insert user data
                string query = @"Insert Into Users(UserName, UserEmail, UserPassword, TypeId) 
                                 values(@name, @email, @pwd, @tid)";

                SqlCommand cmd = new SqlCommand(query, con);

                // Add parameters to prevent SQL injection
                cmd.Parameters.AddWithValue("@name", ud.Name);
                cmd.Parameters.AddWithValue("@email", ud.Email);
                cmd.Parameters.AddWithValue("@pwd", ud.Pass);
                cmd.Parameters.AddWithValue("@tid", ud.TypeID);

                con.Open();

                // Execute insert query
                int row = cmd.ExecuteNonQuery();

                // Check result
                if (row > 0)
                {
                    res = "User Added!!";
                }
                else
                {
                    res = "Error Inserting User!!";
                }
            }

            return res;
        }
    }
}