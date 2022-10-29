const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId} = Schema;

const productSchema = new Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    description:{
        type:String,
        trim:true,
        required:true,
        maxlength:2000
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    category:{
        type:ObjectId,
        ref:'Category',
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    sold:{
        type:Number,
        default:0
    },
    photo:{
        data:Buffer,
        contentType:String
    }
},{timestamps:true})


const Product = mongoose.model('Product', productSchema);

module.exports = Product;