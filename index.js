const express = require("express")
require('dotenv').config();
const connectMongoDB = require("./connection")
const signupRouter = require("./routes/signupRoute")
const otpRoute = require("./routes/otpRoute")
const loginRoute = require("./routes/loginRoute")
const session = require("express-session");
const loginWithGoogleRoute = require("./routes/loginWithGoogleRoute")
const shopRoute = require("./routes/shopRoute")
const userRoute = require("./routes/userRoute")
//const orderRoute = require("./routes/orderRoute")
const app = express()

// Add session middleware before your routes
app.use(session({
    secret: process.env.JWT_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  }));
  
// Initialize passport at the app level
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended:true}))
app.use(express.json())

//MongoDB connection
connectMongoDB();
app.use("/signup", signupRouter)
app.use("/otpverification", otpRoute)
app.use("/login", loginRoute)
app.use("/logout", loginRoute)
app.use("/login_with_google", loginWithGoogleRoute)
app.use("/user", userRoute)
app.use("/shop", shopRoute)
//app.use("/placeorder", orderRoute)

app.listen(3000, ()=>{console.log("App is live at port 3000.");
})