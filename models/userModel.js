const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    email: {
        typeof: String,
    },
    gender: {
        typeof: String,
    },
    password: {
        typeof: String,
    },
    verified: {
        typeof: Boolean,
    },
    otp: {
        typeof: String,
    }
})
userSchema.pre("save", async(next)=>{
    try{
        const user = this
        const saltRound = 10;
        const hashedPassword = bcrypt.hash(user.password, saltRound)
        user.password = hashedPassword
}catch(error){next(error)}
})
const User = mongoose.model("User", userSchema)
module.exports = User