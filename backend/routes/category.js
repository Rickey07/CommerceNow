const express = require('express');
const router = express.Router();
const {getCategoryById , createCategory,getCategory,getAllCategories,updateCategory,deleteCategory} = require('../controllers/category')
const {isAdmin,isSignedIn,isAuthenticated} = require('../controllers/auth')
const {getUserById} = require('../controllers/user')


// Params
router.param("categoryId",getCategoryById)
router.param("userId" , getUserById)

// Routes

// Create
router.post("/category/new/:userId" , isSignedIn,isAuthenticated,isAdmin,createCategory)

// Read
router.get('/category/:categoryId' , getCategory)
router.get('/categories' , getAllCategories)

//Update
router.put("/category/update/:categoryId/:userId", isSignedIn , isAuthenticated , isAdmin , updateCategory);

// Delete
router.delete("/category/delete/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteCategory)

module.exports = router