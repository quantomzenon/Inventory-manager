//Acquiring Neccesary Modules:
const express= require("express");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const res = require("express/lib/response");
const app= express();
// const database=require(__dirname+"/js/db.js");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost:27017/invDB",{useNewUrlParser: true});

// Database Connectivity
const productSchema= new mongoose.Schema({
    ino:Number,
    name:String,
    barcode:Number,
    price:Number,
    qty:Number
});
const Product=mongoose.model("Product",productSchema);
const saleSchema= new mongoose.Schema({
    ino:Number,
    name:String,
    barcode:Number,
    cprice:Number,
    sprice:Number,
    qty:Number,
    cname:String
});
const Sale=mongoose.model("Sale",productSchema);
const customerSchema=new mongoose.Schema({
    cno:Number,
    name:String,
    pno:Number,
    items:[{name:String,barcode:Number,price:Number}]
});
const Customer=mongoose.model("Customer",customerSchema);
const cartSchema=new mongoose.Schema({

    name:String,
    barcode:Number,
    price:Number
});
const Cart=mongoose.model("Cart",cartSchema);

//items to be added
const product1=new Product({
    ino:1,
    name:"Pen",
    barcode:123123,
    price:10,
    qty:25
});
const product2=new Product({
    ino:2,
    name:"Pencil",
    barcode:124124,
    price:5,
    qty:35
});
const defaultItems=[product1,product2];



//Signin portion
app.get("/",function(req,res){
    res.sendFile(__dirname+"/Login/signin.html");
});
app.post("/",function(req,res){
    var uname=req.body.userName;
    var pswd=req.body.passWORD;
    if(uname=="admin" && pswd=="user")
    {res.sendFile(__dirname+"/HTML/Dashboard.html");}
    else
    {res.send("<h1>Login Failed</h1>");}
});

//Inventory Portion
app.get("/inventory",function(req,res){
    // res.sendFile(__dirname+"/Table/inventory.html");
    Product.find({},function(err,foundItems){
        
        if(foundItems.length == 0){
            Product.insertMany(defaultItems,function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("Succesfully saved items to DB");
            }
            });
            res.redirect("/inventory");
        }else{
            res.render("inventory",{newProd:foundItems}); 
        }
        
    });   
});
// Requiring data from user and adding to Inventory.
var item=[];
app.post("/inventory",function(req,res){
    item[0]=req.body.newNum;
    item[1]=req.body.newItem;
    item[2]=req.body.newBarcode;
    item[3]=req.body.newPrice;
    item[4]=req.body.newQuantity;

    const product = new Product({
        ino:item[0],
        name:item[1],
        barcode:item[2],
        price:item[3],
        qty:item[4]
    })
    product.save();
    res.redirect("/inventory");

});
//To delete Item from inventory
app.post("/delete",function(req,res){
    let delIndex=req.body.delNum;

    Product.deleteOne({ino:delIndex},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Deleted Item Succesfully");
        }
    });
    res.redirect("/inventory");
});
//To update Quantity in inventory
app.post("/update",function(req,res){
    let upIndex=req.body.upNum;
    let upVal=req.body.upQty;
    
    Product.updateOne({ino:upIndex},{qty:upVal},{ runValidators: true },function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Updated Item Succesfully");
        }
    });
    res.redirect("/inventory");
});


// Billing Page
var cartitems=[];
// TO Display the  Billing Page
app.get("/billing",function(req,res){
    Cart.find({},function(err,foundItems){
        if(err)
        {
            console.log(err);
        }else{
            Cart.find({},function(err,foundItems){
                if(err)
                {
                    console.log(err);
                }else{
                    let totVal=0;
                    for(let i=0;i<foundItems.length;i++)
                    {
                        totVal=totVal+foundItems[i].price;
                    }
                    res.render("billing",{newCart:foundItems,totSum:totVal,numItems:foundItems.length});
                }
            });
        }
    });   
});
//To Add Items to The Cart
app.post("/billing",function(req,res){
    let iname=req.body.itemName;
        Product.find({name:iname},function(err,foundItems){
            if(err)
            {
                console.log(err);
            }else{
                cartitems[0]=foundItems[0].name;
                cartitems[1]=foundItems[0].barcode;               
                cartitems[2]=foundItems[0].price;
            
                const cart = new Cart({ 
                    name:cartitems[0],
                    barcode:cartitems[1],
                    price:cartitems[2]
                });
                // console.log(cart);
                cart.save();
                res.redirect("/billing");
            }
        });
        Product.findOneAndUpdate({name:iname},{ $inc: { qty: -1 } },{ runValidators: true },function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Decremented "+iname+" Succesfully");
                
            }
        });
             
});
//To Delete Items from the Cart
app.post("/deletebillItem",function(req,res){
    let delName=req.body.itemSelect;
    Cart.deleteOne({name:delName},function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Deleted Item Succesfully");
                res.redirect("/billing");
            }  
        });
        Product.findOneAndUpdate({name:delName},{ $inc: { qty: 1 } },{ runValidators: true },function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Incremented "+delName+" Succesfully");
                
            }
        });
})
// Adds Customer Details+Bought Items to Cart Collection.
app.post("/customer",function(req,res){
    let custName=req.body.custName;
    let phoneNo=req.body.phoneNo;
    let count;
    //to count number of items in customer collection
    Customer.count({}, function(err, numItems){
        // console.log( "Number of docs: ", numItems );
        count=numItems;
    });
    Cart.find({},function(err,cartItems){
        if(err){console.log(err);}
        else{
            const customer = new Customer({ 
                cno:count+1,
                name:custName,
                pno:phoneNo,
                items:cartItems
            });
            // console.log(customer);
            customer.save();
            Cart.deleteMany({},function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Cleared The Cart");
                }
            });
        }   
    });
    res.redirect("/billing");
})








//Rest of Modules
app.get("/dashboard",function(req,res){
    res.sendFile(__dirname+"/HTML/Dashboard.html");
})

app.get("/sales",function(req,res){
    res.sendFile(__dirname+"/HTML/sales.html");
})
app.get("/stats",function(req,res){
    res.sendFile(__dirname+"/HTML/stats.html");
})




app.listen(3000,function(){
    console.log("Server started at port: 3000")
});
