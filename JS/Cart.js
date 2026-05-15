function Payment() {

    let cardNo=$("#txtCardNo").val();
    
    let name=$("#txtName").val();
    
    let mobNo=$("#txtMobNo").val();
    
    let cvv=$("#txtCVV").val();
    if(!cardNo){alert("Enter card number"); return;}
    if(cardNo.length!=16 ){alert("Card number must be 16 numbers only!!");return;}
    if(!name){alert("Enter Name");return;}
    if(mobNo.length!=10){alert("Enter 10 digit Mobile number."); return;}
    if(cvv.length!=3){alert("Enter only 3 digit CVV"); return;}
    // ================= GET SERVER CART =================
    $.ajax({
        url: cartApi,
        type: "GET",
        success: function (cart) {

            if (!cart || cart.length === 0) {
                alert("Your Cart is Empty!");
                return;
            }

            const userID = parseInt(sessionStorage.getItem("userID"));

            // ================= 1. CREATE BILL =================
            $.ajax({
                url: "http://localhost:50312/api/Bill",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ UserID: userID }),

                success: function (billID) {

                    console.log("Bill Created:", billID);

                    // ================= 2. BUILD BILL DETAILS (FIXED AMOUNT) =================
                    const billDetails = cart.map(item => ({
                        BillID: billID,
                        ProdID: parseInt(item.ProdID),
                        Qty: parseInt(item.Qty),

                        Amt: parseInt(item.Qty) * parseFloat(item.Amt || item.Price)
                    }));

                    // ================= 3. SAVE BILL DETAILS =================
                    $.ajax({
                        url: "http://localhost:50312/api/BillDetails",
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(billDetails),

                        success: function () {

                            // ================= 4. REDUCE STOCK (ONLY AFTER SUCCESS) =================
                            let requests = [];

                            cart.forEach(item => {
                                requests.push(
                                    $.ajax({
                                        url: prodApi,
                                        type: "GET",
                                        success: function (products) {

                                            let prod = products.find(p => p.ProdID == item.ProdID);
                                            if (!prod) return;

                                            prod.Qty = prod.Qty - item.Qty;

                                            $.ajax({
                                                url: prodApi,
                                                type: "PUT",
                                                contentType: "application/json",
                                                data: JSON.stringify(prod)
                                            });
                                        }
                                    })
                                );
                            });

                            // ================= 5. CLEAR CART AFTER STOCK UPDATE =================
                            $.when.apply($, requests).done(function () {

                                let deleteReq = cart.map(item => {
                                    return $.ajax({
                                        url: cartApi + "/" + item.ProdID,
                                        type: "DELETE"
                                    });
                                });

                                $.when.apply($, deleteReq).done(function () {

                                    localStorage.removeItem("cart");

                                    sessionStorage.setItem("billData", JSON.stringify({
                                        BillID: billID,
                                        Items: billDetails
                                    }));

                                    alert("Payment Successful!");
                                    window.location.href = "Bill.html";
                                });
                            });
                        },

                        error: function (err) {
                            console.log(err);
                            alert("Error saving bill details!");
                        }
                    });
                },

                error: function (err) {
                    console.log(err);
                    alert("Error creating bill!");
                }
            });
        },
        error:(err)=>{
            console.log(err);
            
        }
    });
}

const API = {
    cart: "http://localhost:50312/api/Cart",
    product: "http://localhost:50312/api/Product",
    user: "http://localhost:50312/api/User"
};

// ---------------- UTIL ----------------
function isLoggedIn() {
    return !!sessionStorage.getItem("userEmail");
}

function num(v) {
    return Number(v || 0);
}

// ---------------- INIT ----------------
$(document).ready(function () {
    loadCart();
    updateCartCounter();
});

function insertCart(item) {
    $.ajax({
        url: API.cart,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(item),
        success: function () {
            updateCartCounter();
        }
    });
}

// ---------------- UPDATE ----------------
function updateCart(item) {
    $.ajax({
        url: API.cart,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(item),
        success: function () {
            loadCart();
            updateCartCounter();
        }
    });
}

// ---------------- LOAD CART ----------------
function loadCart() {

    // ================= GUEST =================
    if (!isLoggedIn()) {
        loadLocalCart();
        return;
    }

    $.ajax({
        url: API.cart,
        type: "GET",
        success: function (cart) {

            $.ajax({
                url: API.product,
                type: "GET",
                success: function (products) {

                    let html = "";
                    let total = 0;

                    cart.forEach(item => {

                        const product = products.find(p => p.ProdID == item.ProdID);
                        if (!product) return;

                        let qty = num(item.Qty);
                        let price = num(product.Price);

                        total += qty * price;

                        html += `
                        <div class="imges">
                            <img src="${product.Image}">
                            <div class="imgprop">
                                <p>${product.DSC}</p>

                                <div>₹${price}</div>
                                <div>Qty: ${qty}</div>

                                <button class="btn-add" onclick="changeServerQty(${item.ProdID}, -1)">-</button>
                                <button class="btn-add" onclick="addToCart(${item.ProdID}, ${products.Qty})">+</button>
                            </div>
                        </div>`;
                    });

                    $("#cart-container").html(html || "<h3>Cart Empty</h3>");
                    $("#total-bill").text("₹" + total.toFixed(2));

                    updateCartCounter();
                    refreshCartCounter();
                }
            });
        }
    });
}

// ---------------- LOCAL CART ----------------
function loadLocalCart() {

    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    let html = "";
    let total = 0;

    $.ajax({
        url: API.product,
        type: "GET",
        success: function (products) {
        //  const product = products.find(p => p.ProdID == item.ProdID);

         cart.forEach(item => {
 const product = products.find(p => p.ProdID == item.ProdID);
        let qty = num(item.Qty);
        let price = num(item.Price);

        total += qty * price;

        html += `
        <div class="imges">
            <img src="${item.Image}">
            <div class="imgprop">
                <p>${item.ProdName}</p>

                <div>₹${item.Price}</div>
                <div>Qty: ${qty}</div>

                <button class="btn-add" onclick="changeLocalQty(${item.ProdID}, -1)">-</button>
                <button class="btn-add" onclick="addToCart(${item.ProdID},${product.Qty})">+</button>
            </div>
        </div>`;
    });

    $("#cart-container").html(html || "<h3>Cart Empty</h3>");
    $("#total-bill").text("₹" + total.toFixed(2));

    updateCartCounter();
    refreshCartCounter();
},
error:(err)=>{
    console.log(err);
}
});
}

// ---------------- LOCAL QTY ----------------
function changeLocalQty(id, change) {

    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    cart = cart.map(i => {
        if (i.ProdID == id) {
            i.Qty = num(i.Qty) + change;
        }
        return i;
    }).filter(i => i.Qty > 0);

    sessionStorage.setItem("cart", JSON.stringify(cart));
    loadLocalCart();
}

// ---------------- SERVER QTY ----------------
function changeServerQty(id, change) {

    $.ajax({
        url: API.cart,
        type: "GET",
        success: function (cart) {

            let item = cart.find(c => c.ProdID == id);
            if (!item) return;

            let newQty = item.Qty + change;

            if (newQty <= 0) {
                deleteCart(id);
                return;
            }

            updateCart({
                CartID: item.CartID,
                UserID: item.UserID,
                ProdID: item.ProdID,
                Qty: newQty,
                Amt: item.Amt
            });
        }
    });
}

// ---------------- DELETE ----------------
function deleteCart(id) {
    $.ajax({
        url: API.cart + "/" + id,
        type: "DELETE",
        success: function () {
            loadCart();
            updateCartCounter();
        }
    });
}

function proceed(){
if (!isLoggedIn()) {

        let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            alert("Your Cart is Empty!");
            return;
        }

        sessionStorage.setItem("redirectAfterLogin", "cartl");
        window.location.href = "./LoginPage.html";
        return;
    }

    window.location.href="./payment.html";
}