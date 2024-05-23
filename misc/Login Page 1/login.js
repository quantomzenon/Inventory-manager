function validate(path)
{
    var username=document.getElementById("username").value;
    var password=document.getElementById("password").value;
    var Sbutton=document.lastElementChild.firstElementChild.lastElementChild;
    if(username=="admin" && password=="user")
    {
        alert("Login Succesfull");
    }
    else
    {
        alert("Login Failed");
    }
}
