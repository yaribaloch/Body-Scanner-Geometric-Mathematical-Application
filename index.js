const express = require("express")
require('dotenv').config();
const connectMongoDB = require("./connection")
const signupRouter = require("./routes/signupRoute")
const otpRoute = require("./routes/otpRoute")
const loginRoute = require("./routes/loginRoute")
const loginWithGoogleRoute = require("./routes/loginWithGoogleRoute")
const loginWithFacebookRoute = require("./routes/loginWithFacebookRoute")
const shopRoute = require("./routes/shopRoute")
const userRoute = require("./routes/userRoute")
//const orderRoute = require("./routes/orderRoute")
const app = express()
  
// Initialize passport at the app level
const passport = require("passport");
app.use(passport.initialize());

app.use(express.urlencoded({extended:true}))
app.use(express.json())

//MongoDB connection
connectMongoDB();
app.use("/signup", signupRouter)
app.use("/otpverification", otpRoute)
app.use("/login", loginRoute)
app.use("/logout", loginRoute)
app.use("/login_with_google", loginWithGoogleRoute)
app.use("/login_with_facebook", loginWithFacebookRoute)
app.use("/user", userRoute)
app.use("/shop", shopRoute)

app.listen(3000, ()=>{console.log("App is live at port 3000.");
})