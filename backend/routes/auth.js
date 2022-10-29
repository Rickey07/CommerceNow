const express = require('express');
const router = express.Router();
const {signOut,signUp,signIn,isSignedIn} = require('../controllers/auth');
const {body} = require('express-validator');


router.post('/signup',[body('name',"Name should be at least 5 characters").isLength({min:5}).trim(),
body('email','email is required').isEmail(),
body('password','Password should be at least 6 characters').isLength({min:6})] , signUp)

router.post('/signin',[
body('email','email is required').isEmail(),
body('password','Password should be at least 6 characters').isLength({min:6})] , signIn)


router.get('/signout',signOut)

router.get('/test', isSignedIn ,(req,res) => {
    res.json(req.auth)
})
module.exports = router;