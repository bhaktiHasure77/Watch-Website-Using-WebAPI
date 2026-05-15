    function Login() {
    let email = $('#email').val().trim();
    let pass = $('#pass').val().trim();

    if (!email || !pass) {
        alert("Enter Email and Password!");
        return;
    }

    $.ajax({
        url: userApi,
        type: "GET",
        success: function(users) {
            const user = users.find(u => u.Email === email && u.Pass === pass);
            if (!user) {
                alert("Invalid Credentials!! Try Again.");
                return;
            }

            // Store session
            sessionStorage.setItem("userEmail", email);
            sessionStorage.setItem("userID", user.UserID);
            sessionStorage.setItem("userName",user.Name);

            alert("Login Successful!! Welcome " + (user.TypeID === 1 ? "Admin" : user.Name));

            const redirect = sessionStorage.getItem("redirectAfterLogin");
            if(user.TypeID === 1) {
                sessionStorage.setItem("type",user.TypeID);
                window.location.href = "./AdminHome.html";
                return;
            }
             if (redirect === "cart") {
                // Merge guest cart first, then load Cart page
                mergeCart(user.UserID, function() {
                    sessionStorage.removeItem("redirectAfterLogin");
                    window.location.href = "./payment.html"; // Cart page will load merged cart
                });
            }else {
                window.location.href = "./Home.html";
            }
        },
        error: function(err) {
            console.error("Login Error:", err);
            alert("Error logging in. Please try again.");
        }
    });
}


function mergeCart(userID, callback) {

    let localCart = JSON.parse(sessionStorage.getItem("cart")) || [];

    // Nothing to merge
    if (localCart.length === 0) {
        callback();
        return;
    }

    let i = 0;

    function processNext() {

        if (i >= localCart.length) {

            // Clear guest cart AFTER merge
            localStorage.removeItem("cart");

            if (callback) callback();
            return;
        }

        let item = localCart[i];

        $.ajax({
            url: cartApi,
            type: "POST",
            contentType: "application/json",

            data: JSON.stringify({
                UserID: userID,
                ProdID: item.ProdID,
                Qty: Number(item.quantity ?? item.Qty ?? 0),
                Amt: Number(item.Price ?? 0)
            }),

           

            success: function () {
                console.log("Merged item:", item.ProdID);
            },

            error: function (err) {
                console.error("Error merging item:", item, err);
            },

            complete: function () {
                i++;
                processNext(); // process next item ONLY after previous finishes
            }
        });
    }

    processNext();
}



    