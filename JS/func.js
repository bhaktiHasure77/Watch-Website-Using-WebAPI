$(document).ready(function() {
   updateCartCounter();
   updateUserIcon();
});
//web API's

const cartApi="http://localhost:50312/api/Cart";
const prodApi="http://localhost:50312/api/Product";
const userApi="http://localhost:50312/api/User";



function insertCart(product,userID){
     $.ajax({
        url:cartApi,
        type:"POST",
        async:false,
        contentType:"application/json",
        data:JSON.stringify({
            UserID:userID,
            ProdID: product.ProdID,
            Qty: 1,
            Price: product.Price
        }),
        success: () => {
            alert("Product Addeed to Cart!!");
            updateCartCounter();
        
        },
        error: (err) => console.log(err)
    });

}
function updateCart(item){
    $.ajax({
        url: cartApi,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            UserID:item.UserID,
            ProdID: item.ProdID,
            Qty: item.Qty,
            Price: item.Price
        }),
        success: () => {alert("Product Added to Cart!!")
            updateCartCounter();
            
        },
        error: (err) => console.log(err)
    });
}


function addToCart(prodID, stockQty) {

    $.ajax({
        url: API.product,
        type: "GET",
        success: function (products) {

            const product = products.find(p => p.ProdID == prodID);
            if (!product) return;
            const email=sessionStorage.getItem("userEmail");
            // ================= GUEST CART =================
            if (!email) {

                let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

                let item = cart.find(i => i.ProdID == prodID);

                if (item) {

                    if (item.Qty >=  stockQty) {
                        alert("Out of stock");
                        return;
                    }

                    item.Qty += 1;
                } else {

                    cart.push({
                        ProdID: product.ProdID,
                        ProdName: product.Name,
                        Price: product.Price,
                        Image: product.Image,
                        Qty: 1
                    });
                }

                sessionStorage.setItem("cart", JSON.stringify(cart));
                loadCart();
                updateCartCounter();
                return;
            }

            // ================= LOGGED IN =================
            $.ajax({
                url: API.user,
                type: "GET",
                success: function (users) {

                    const email = sessionStorage.getItem("userEmail");
                    const user = users.find(u => u.Email === email);

                    if (!user) return;

                    $.ajax({
                        url: API.cart,
                        type: "GET",
                        success: function (cart) {

                            let existing = cart.find(c => c.ProdID == prodID);

                            if (existing) {
                                if (existing.Qty >= stockQty) {
                                    
                                    alert("Out of stock");                                    
                                    return;
                                }
                                updateCart({
                                    CartID: existing.CartID,
                                    UserID: existing.UserID,
                                    ProdID: existing.ProdID,
                                    Qty: existing.Qty + 1,
                                    Amt: product.Price
                                });

                            } else {

                                insertCart({
                                    UserID: user.UserID,
                                    ProdID: product.ProdID,
                                    Qty: 1,
                                    Amt: product.Price
                                });
                            }

                            loadCart();
                        },
                        error:(err)=>{
                            console.log(err);
                            
                        }
                    });
                }
            });
        }
    });
}   


   

function updateCartCounter(){
    const email=sessionStorage.getItem("userEmail");
 

 let count = 0;

    // ================= GUEST =================
    if (!email) {

        let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        count = cart.reduce((sum, i) => sum + Number(i.Qty || 0), 0);

    } 
    // ================= LOGGED IN =================
    else {

        $.ajax({
            url: API.cart,
            type: "GET",
            success: function (cart) {

                count = cart.reduce((sum, i) => sum + Number(i.Qty || 0), 0);

                refreshCartCounter(count);
            },
            error: function () {
                refreshCartCounter(0);
            }
        });

        return; // IMPORTANT (stop double execution)
    }

    refreshCartCounter(count);
}

function refreshCartCounter(count){
     let icon = $(".fa-cart-shopping");

    if (!icon.length) {
        console.warn("Cart icon not found in DOM");
        return;
    }

    $(".cart-badge").remove();

    if (count > 0) {
        icon.parent().append(`
            <span class="cart-badge">${count}</span>
        `);
    }

}
function updateUserIcon(){
    let userIcon=$("#user-icon");
    let email=sessionStorage.getItem("userID");
    if(email){
        userIcon.html(`
            <i class="fa-solid fa-right-from-bracket"
               title="Logout"
               style="cursor:pointer; font-size:22px;"
               onclick="logoutUser()">
            </i>
        `);
    }else{
        userIcon.html( `
            <a href="./LoginPage.html" title="Login">
                <i class="fa-solid fa-right-to-bracket" style="font-size:22px;"></i>
            </a>
        `);
    }
}
function logoutUser(){
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userID");
    sessionStorage.removeItem("cart");
    localStorage.removeItem("type");

    alert("Logged Out Succesfully!!"); 
    
    updateCartCounter();    
     updateUserIcon();
     window.location.href="Home.html";
}


    

    
