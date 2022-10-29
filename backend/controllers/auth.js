const User = require('../models/user');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');

exports.signOut = (req,res) => {
    res.clearCookie("token")
    res.send("User successfully signedOut");
}

exports.signUp = async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        if(await User.findOne({email:req.body.email})) {
            return res.status(400).json({error:"User already exists with this email"})
        }
        const user = new User(req.body);
         user.save((err,user) => {
            if(err) {
                return res.status(400).json({
                    err:"Not able to save user in Db"
                })
            }
            res.json({name:user.name,email:user.email,id:user._id})
         });
    } catch (error) {
        console.log(error.message)
    }
}


exports.signIn = async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()})
    }

    try {
        const {email,password} = req.body;
        // Check if the user is present in the database
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({error:"Account associated with email not found"})
        } 

        // Check if the email and password is correct

        if(!user.authenticate(password)){
            return res.status(401).json({error:"Email and password doesn't match"})
        }

        //Create token
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);

        //Put token in cookie 
        res.cookie("token",token,{expire:new Date() + 9999})

        // Send response to the front-end
        const {_id,name,role} = user;
        return res.json({token,user:{_id,name,email:user.email,role}})


    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error.message})
    }
}

// Protected Routes

exports.isSignedIn = expressjwt.expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms:["HS256"],
    requestProperty:"auth"
})

// Custom MiddleWares

exports.isAuthenticated = (req , res ,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error:"Access Denied"
        })
    }
    next();
}


exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({
            error:"Access Denied"
        })
    }
    next()
}