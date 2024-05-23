const mongoose=require("mongoose");

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

console.log("Succesfully Started DB");

