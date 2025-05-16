const express = require("express")
const passport = require("passport")
const {User} = require("../models/userModel")
const googleStrategy = require("passport-google-oauth20").Strategy
const router = express.Router();
passport.use(new googleStrategy({
    clientID: process.env.G_CLIENT_ID,
    clientSecret: process.env.G_CLIENT_SECRET,
    callbackURL: process.env.G_LOGIN_CALLBACK_URL
}, async function(accessToken, refreshToken, profile, cb){
    const googleId=profile.id
    const user = await User.findOne({googleId})
    if(!user){
        console.log("User not found.");
        
        const newUser = new User({
            googleId:googleId,
            name: profile.displayName, 
            email: profile.emails[0]?.value, 
            verified: true,
        })
        await newUser.save()
        return cb(null, newUser)
    }else{
        console.log("User found.");
     return cb(null, user)
    }
}
))
passport.serializeUser((user, done)=>done(null, user))
passport.deserializeUser((user, done)=>done(null, user))

// router.get("/", passport.authenticate('facebook', {scope: ['email']}))
// router.get('/callback', passport.authenticate('facebook', {failureRedirect:'auth/facebook/error'}), function(res,req){
//     res.redirect('http://localhost:3000/shop/products')
// })
router.get("/", (req, res)=>{
    res.send('<a href="/login_with_google/auth/google">Login With Google</a>')
})
router.get('/auth/google', passport.authenticate('google', {scope:["profile", "email"]}))
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect:'/login_with_google/auth/google/error'}), function(req, res){
    console.log
    ("ID: ",req.user._id)
    res.redirect('http://localhost:3000/shop/products')
})

module.exports = router