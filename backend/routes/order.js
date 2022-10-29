const express = require('express');
const router = express.Router();
const {getUserById,pushOrderInPurchaseList} = require('../controllers/user');
const {isAdmin,isAuthenticated,isSignedIn} = require('../controllers/auth');
const {updateStock} = require('../controllers/product')
const {getOrderById, createOrder, getAllOrders , getOrderStatus , updateOrderStatus} = require('../controllers/order')

// Params 
router.param("userId" , getUserById);
router.param("orderId" , getOrderById);


// Routes

// Create
router.post("/order/create/:userId" , isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateStock,createOrder);


// Read Routes
router.get('/orders/:userId' , isSignedIn,isAuthenticated,isAdmin,getAllOrders);


// Status of order
router.get('/order/get/status/:userId' , isSignedIn , isAuthenticated , isAdmin , getOrderStatus)
router.put("/order/:orderId/status/:userId" , isSignedIn , isAuthenticated , isAdmin , updateOrderStatus)







module.exports = router