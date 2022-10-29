const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const {getProductById,createProduct,getProduct,parsePhoto,updateProduct,deleteProduct, getAllProducts, getAllUniqueCategories} = require('../controllers/product')
const {getUserById} = require('../controllers/user')
const {isAdmin,isAuthenticated,isSignedIn} = require('../controllers/auth')



// Params
router.param('productId' , getProductById);
router.param('userId' , getUserById);

//Routes

//Create Product
router.post("/product/create/:userId" ,isSignedIn,isAuthenticated,isAdmin,createProduct);

//Get Product
router.get("/product/:productId",getProduct);
router.get('/product/photo/:productId',parsePhoto);

// Update Route
router.put("/product/update/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);

// Delete Route
router.delete("/product/delete/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct)


// Listing Route
router.get('/products' , getAllProducts)

router.get('/products/categories',getAllUniqueCategories)
module.exports = router;