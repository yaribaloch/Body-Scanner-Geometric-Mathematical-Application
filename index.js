const express = require("express")
require('dotenv').config();
const connectMongoDB = require("./connection")
const signupRouter = require("./routes/signupRoute")
const otpRoute = require("./routes/otpRoute")
const loginRoute = require("./routes/loginRoute")
const shopRoute = require("./routes/shopRoute")
const orderRoute = require("./routes/orderRoute")
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

//MongoDB connection
connectMongoDB();
app.use("/signup", signupRouter)
app.use("/otpverification", otpRoute)
app.use("/login", loginRoute)
app.use("/shop", shopRoute)
app.use("/placeorder", orderRoute)

app.listen(3000, ()=>{console.log("App is live at port 3000.");
})