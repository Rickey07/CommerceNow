const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId} = Schema;

const productSchema = new Schema({
    product:{
    type:ObjectId,
    ref:"Product"
    },
    name:String,
    count:Number,
    price:Number
})

const ProductCart = mongoose.model("ProductCart",productSchema);

const orderSchema = new Schema({
    products:[productSchema],
    transaction_id:{

    },
    amount:{
        type:Number
    },
    address:{
        type:String
    },
    status:{
        type:String,
        default:"",
        enum:["Cancelled","Delivered","Shipped","Recieved"]
    },
    updated:{
        type:Date
    },
    user:{
        type:ObjectId,
        ref:"User"
    }
},{timestamps:true})

const Order = mongoose.model('Order' , orderSchema);

module.exports = {Order,ProductCart}