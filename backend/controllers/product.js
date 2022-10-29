const formidable = require('formidable');
const Product = require('../models/product');
const fs = require('fs')

exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,product) => {
        if(err) {
            res.status(400).json({error:"No Product found with this ID"})
        }
        req.product = product
        next();
    })
}

exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.parse(req,(err,fields,file) => {
        if(err) {
           return res.status(400).json({err:"Problem with found"})
        }
        const {price,description,name,category,stock} = fields;

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error:"Please include all fields"
            })
        }

        let product = new Product(fields);

        // Handle File here
        if(file.photo) {
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    err:"File is too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.filepath);
            product.photo.contentType = file.photo.mimetype
        }

        // Saving in DB.
        product.save((err,product) => {
            if(err) {
                console.log(err);
                res.status(400).json({
                    error:"Saving T-shirt in DB failed"
                })
            }
            res.json(product)
        })

    })
}


exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product) 
}

// middleWares for parsing the image

exports.parsePhoto = (req,res,next) => {
    if (req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next()
}


exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.parse(req,(err,fields,file) => {
        if(err) {
           return res.status(400).json({err:"Problem with image"})
        }
        const {price,description,name,category,stock} = fields;

        let product = req.product;
        product = _.extend(product,fields);

        // Handle File here
        if(file.photo) {
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    err:"File is too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.filepath);
            product.photo.contentType = file.photo.mimetype
        }

        // Saving in DB.
        product.save((err,product) => {
            if(err) {
                console.log(err);
                res.status(400).json({
                    error:"Updation Failed"
                })
            }
            res.json(product)
        })

    })
}

exports.deleteProduct = (req,res) => {
    Product.findByIdAndDelete(req.product._id)
            .exec((err,deletedProduct) => {
                if (err) {
                    return res.status(403).json(
                        {error:"Not able to delete the product"}
                    )
                }
                return res.json({msg:"Product has been successfully deleted"})
            })
}

exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit):8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products) => {
        if (err) {
            return res.status(400).json({error:"No Product Found"})
        }
        res.json(products);
    })
}

exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category",{},(err,categories) => {
        if(err) {
            return res.status(400).json({
                msg:"No categories found"
            })
        }
        res.json(categories);
    })
}

// Middleware to update the Stock
exports.updateStock = (req , res , next) => {
    let myOperations = req.body.order.products.map((product) => {
        return {
            updateOne: {
                filter:{_id:product._id},
                update:{$inc:{stock:-product.count,sold: +product.count}}
            }
        }
    })

    Product.bulkWrite(myOperations,{} , (err,products) => {
        if (err) {
            return res.status(400).json({message:"Bulk Operations failed"})
        }
        next()
    })
}