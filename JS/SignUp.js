
const userApi="http://localhost:50312/api/User";
function Data(){
    let name=$('#name').val().trim();
    let email=$('#email').val().trim();
    let pass=$('#pass').val();
    let confirmPass=$('#pass2').val().trim();
    if(pass==confirmPass){
    return {
        Name:name,
        Email:email,
        Password:pass,
        TypeID:2

    }
}else{
   alert("Confirm Password isn't Matching with Password");
   return ;
}
}
function AddUser(data){
    $.ajax({
        url:userApi,
        type:"POST",
        contentType:"application/json",
        
        data:JSON.stringify(data),
        success:()=>{
            alert("Signed Up Successfully!! Welcome ");
            window.location.href="LoginPage.html";
        },
        error:(err)=>{
            alert("An error occurred while Signing in! Please try again")
        }
    });
}
function SignUp(){
    let data=Data();

    $.ajax({
        url:userApi,
        type:"GET",       
        async: false,
        // data:JSON.stringify(data),
        success:(users)=>{
            let exist = users.some(ele => ele.Email === data.Email);
            if(exist){
                alert("User Exists!! Please Login");
            } else {
                AddUser(data);
            }
        },  
    
        error:(err)=>{
            console.log("Error During Login : "+err);
            alert('An error occurred while logging in. Please try again.');
            }
            
       
    });
}