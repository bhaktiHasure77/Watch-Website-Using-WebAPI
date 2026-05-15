
// NAVBAR

const role = localStorage.getItem("type");

let navHTML = `
<nav class="navdiv">
  <div class="logo">
    <img src="./img/Logo.png" height="100px" width="190px" />
  </div>

  <ul type=none>
    <li><a href="./Home.html">Home</a></li>

    <li>
      <a href="#">Gender <i class="fa-solid fa-angle-down"></i></a>
      <div class="dropdown">
         <table>       
        <tr>
          <td><a href="./Women.html">Women</a></td>         
        </tr>
        <tr> 
          <td><a href="./Men.html">Men</a></td>
        </tr>
        <tr>
          <td><a href="./Unisex.html">Unisex</a></td>
        </tr>
        </table>
      </div>
    </li>
`;


if (role === 1) {
  navHTML += `
    <li><a href="./Admin.html">Admin Panel</a></li>
  `;
}else{
   navHTML += `
    <li><a href="./Bill.html">View Orders</a></li>
  `;
}

// COMMON LINKS
navHTML += `
    <li><a href="./About.html">About Us</a></li>
    <li><a href="./Contact.html">Contact</a></li>
  </ul>

  <div class="icon" id="user-icon">
     <i class="fa-solid fa-right-from-bracket" onclick="logoutUser()"></i>
  </div>
`;

// CART ONLY FOR USER
if (role != 1) {
  navHTML += `
    <div class="icon">
      <a href="./Cart.html"><i class="fa-solid fa-cart-shopping"></i></a>
    </div>
  `;
}

navHTML += `</nav>`;

$(".navbar").html( navHTML);



// const footer = document.getElementById("footer");

$(".footer").html(`<footer>
      <div class="footer-container">
         <div class="flex-wrapper">
            <div class="footer-wrapper">
              <a href="./Home.html" class="logo2"><img src="./img/logo.png" alt="" height="90px" width="125px"></a>
                <p class="para">
                Luxuarious Watches<br />
                Designed for Royalty and Uniqueness.
                </p>
              <div class="Icon" style="gap: 2rem">
              <br>
              <a href="">
                <i
                  class="fa-brands fa-x-twitter"
                  style="color: #000000"
                ></i>
              </a>
              <a href="">
                <i
                  class="fa-brands fa-instagram"
                  style="color: #000000"
                ></i>
              </a>
              <a href="">
                <i
                  class="fa-brands fa-facebook-f"
                  style="color: #000000"
                ></i>
              </a>
              <a href="">
                <i
                  class="fa-brands fa-google-plus-g"
                  style="color: #000000"
                ></i>
              </a>
              </div>
            </div>
            <div class="footer-list">
            <div>
              <h3>Available in</h3>
             <ul>
                <li><a href="#" class="footer-link">Bangalore</a></li>
                <li><a href="#" class="footer-link">Gurgaon</a></li>
                <li><a href="#" class="footer-link">Hyderabad</a></li>
                <li><a href="#" class="footer-link">Delhi</a></li>
                <li><a href="#" class="footer-link">Mumbai</a></li>
                <li><a href="#" class="footer-link">Pune</a></li>          
              </ul>
            </div>
            <div>
              <h3>Services</h3>
              <ul>
                <li><a href="#" class="footer-link">Store Locator</a></li>
                <li><a href="#" class="footer-link">Buying Guide</a></li>
                <li><a href="#" class="footer-link">Special Offers</a></li>
              </ul>
            </div>
            <div>
              <h3>Company</h3>
              <ul>
                <li><a href="#" class="footer-link">FAQ's</a></li>
                <li><a href="./About.html" class="footer-link">About Us</a></li>
                <li><a href="./Contact.html" class="footer-link">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3>Life at Luxuarious</h3>
                <ul>
                  <li><a href="#" class="footer-link">Explore With Luxuarious </a></li>
                  <li><a href="#" class="footer-link">Luxuarious News</a></li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
    `);



