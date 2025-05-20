const express = require("express")
const passport = require("passport")
const JWT = require("jsonwebtoken")
const {User} = require("../models/userModel")
const FacebookStrategy = require("passport-facebook").Strategy;const router = express.Router();
passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID ,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: process.env.FB_LOGIN_CALLBACK_URL
}, async function(accessToken, refreshToken, profile, cb){
    const facebookId=profile.id
    const user = await User.findOne({facebookId})
    if(!user){
        console.log("User not found.");
        
        const newUser = new User({
            facebookId:facebookId,
            name: profile.displayName, 
            email: profile.emails[0]?.value, 
            verified: true,
        })
        await newUser.save()
        //We don't want to create sessions as we are using JWT login tokens
        return cb(null, newUser, {session:false})
    }else{
        console.log("User found.");
        //We don't want to create sessions as we are using JWT login tokens
        return cb(null, user, {session:false})
    }
}
))

router.get("/", (req, res)=>{
    res.send('<a href="/login_with_facebook/auth/facebook">Login With Facebook</a>')
})
router.get('/auth/facebook', passport.authenticate('facebook', {scope:["public_profile"]}))
router.get('/auth/facebook/callback', passport.authenticate('facebook', {session:false,failureRedirect:'/login_with_facebook/auth/facebook/error'}), function(req, res){
    const accessToken = JWT.sign({userID:req.user._id}, process.env.JWT_KEY)    
    console.log
    ("ID: ",req.user._id)
    res.status(200).json({
    status: true,
    message: "User authenticated via Facebook.",
    token: accessToken
    })
})

module.exports = router