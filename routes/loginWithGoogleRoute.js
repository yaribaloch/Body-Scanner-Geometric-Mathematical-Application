const express = require("express")
const passport = require("passport")
const JWT = require("jsonwebtoken")
const {User} = require("../models/userModel")
const googleStrategy = require("passport-google-oauth20").Strategy
const router = express.Router();

passport.use(new googleStrategy({
    clientID: process.env.G_CLIENT_ID ,
    clientSecret: process.env.G_CLIENT_SECRET,
    callbackURL: process.env.G_LOGIN_CALLBACK_URL
}, async function(accessToken, refreshToken, profile, cb){
    const googleId=profile.id
    const user = await User.findOne({googleId})
    if(!user){
        const newUser = new User({
            googleId:googleId,
            name: profile.displayName, 
            email: profile.emails[0]?.value, 
            verified: true,
        })
        await newUser.save()
        //We don't want to create sessions as we are using JWT login tokens
        return cb(null, newUser, {session:false})
    }else{
        //We don't want to create sessions as we are using JWT login tokens
        return cb(null, user, {session:false})
    }
}
))

router.get("/", (req, res)=>{
    res.send('<a href="/login_with_google/auth/google">Login With Google</a>')
})
router.get('/auth/google', passport.authenticate('google', {scope:["profile", "email"]}))
router.get('/auth/google/callback', passport.authenticate('google', {session:false,failureRedirect:'/login_with_google/auth/google/error'}), function(req, res){
    const accessToken = JWT.sign({userID: req.user? req.user._id:req.newUser._id}, process.env.JWT_KEY)    
    res.status(300).json({
    status: true,
    message: "User authenticated via Google.",
    token: accessToken
    })
})

module.exports = router