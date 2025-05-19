const express = require("express")
const passport = require("passport")
const JWT = require("jsonwebtoken")
const {User} = require("../models/userModel")
const googleStrategy = require("passport-google-oauth20").Strategy
const router = express.Router();
// router.use(session({
//     secret: process.env.JWT_KEY, // Using your existing JWT key for session
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: process.env.NODE_ENV === 'production' } // Secure in production
//   }));
router.use(passport.initialize());
//router.use(passport.session());
passport.use(new googleStrategy({
    clientID: process.env.G_CLIENT_ID ,
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
// These are required to make passport work with sessions
passport.serializeUser((user, done) => {
    done(null, user.id || user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

// router.get("/", passport.authenticate('facebook', {scope: ['email']}))
// router.get('/callback', passport.authenticate('facebook', {failureRedirect:'auth/facebook/error'}), function(res,req){
//     res.redirect('http://localhost:3000/shop/products')
// })
router.get("/", (req, res)=>{
    res.send('<a href="/login_with_google/auth/google">Login With Google</a>')
})
router.get('/auth/google', passport.authenticate('google', {scope:["profile", "email"]}))
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect:'/login_with_google/auth/google/error'}), function(req, res){
    const accessToken = JWT.sign({userID: req.user? req.user._id:req.newUser._id}, process.env.JWT_KEY)    
    console.log
    ("ID: ",req.user._id)
    res.status(300).json({
    status: true,
    message: "User authenticated via Google.",
    token: accessToken
    })
})

module.exports = router