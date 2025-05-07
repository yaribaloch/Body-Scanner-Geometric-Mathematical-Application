const express = require("express")
const connectMongoDB = require("./connection")
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

//MongoDB connection
connectMongoDB();
app.use("/signup", )