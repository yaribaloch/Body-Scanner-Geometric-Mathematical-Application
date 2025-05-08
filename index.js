const express = require("express")
require('dotenv').config();
const connectMongoDB = require("./connection")
const signupRouter = require("./routes/signupRoute")
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

//MongoDB connection
connectMongoDB();
app.use("/signup", signupRouter)

app.listen(3000, ()=>{console.log("App is live at port 3000.");
})