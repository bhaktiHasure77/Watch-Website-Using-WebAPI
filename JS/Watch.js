$(document).ready( function () {
    adminPanel();
});
///for products

function displayWatch(containerId,catId,brandId){

    let htmlContent = "";
    $.ajax({
        url:prodApi,
        type:"GET",
        success:(product)=>{
            let prod=product.filter((item)=>{
                return item.BrandID==brandId && item.CatID==catId;
            })
           

            prod.forEach(item => {
       htmlContent += `
        <div class="imges">
            <img src="${item.Image}" alt="${item.ProdName}" loading="lazy">
            <div class="imgprop">
                <p class="img-description">${item.DSC}</p>
                <div class="star-container">⭐⭐⭐⭐⭐</div>
                <div><i class="fa-solid fa-indian-rupee-sign"></i> ${item.Price}.00</div>
                <button class="btn-add" onclick="addToCart(${item.ProdID},${item.Qty})">Add To Cart</button>
            </div>
        </div>
        `;
        })
        
        $(containerId).html( htmlContent);// Inject HTML dynamically

    },
    error:(err)=>{
          console.log(" Error: "+err);
    }
        
    });

}

function displayWatchs(containerId,brandId){
let htmlContent = "";
    $.ajax({
        url:prodApi,
        type:"GET",
        success:(product)=>{
            let prod=product.filter((item)=>{
                return item.BrandID==brandId;
            })
           

            prod.forEach(item => {
       htmlContent += `
        <div class="imges">
            <img src="${item.Image}" alt="${item.ProdName}" loading="lazy">
            <div class="imgprop">
                <p class="img-description">${item.DSC}</p>
                <div class="star-container">⭐⭐⭐⭐⭐</div>
                <div><i class="fa-solid fa-indian-rupee-sign"></i> ${item.Price}.00</div>
                <button class="btn-add" type="button" onclick="addToCart(${item.ProdID},${item.Qty})">Add To Cart</button>
            </div>
        </div>
        `;
        })
        
        $(containerId).html( htmlContent);// Inject HTML dynamically

    },
    error:(err)=>{
          console.log(" Error: "+err);
    }
        
    });
}

function adminPanel(){
    const type=sessionStorage.getItem("type");
    if(type==1){
        $("#admin").html(`<a href="./AdminHome.html">Admin Panel</a>`);
        $("#abouts").hide();
        $("#contacts").hide();
         $("#carti").hide();
          $("#order").hide();
    }
    else if(type==2){
        $("#admin").hide();
       
    }else{
        //  $("#abouts").show();
        // $("#contacts").show();
        //  $("#carti").show();
        //   $("#order").show();
    }
}
