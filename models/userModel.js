const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    gender: {
        type: String,
    },
    password: {
        type: String,
    },
    verified: {
        type: Boolean,
    },
    otp: {
        type: String,
    }
})
userSchema.pre("save", async function(next) {
    const user = this
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt)
        user.password = hashedPassword
        next()
}catch(error){next(error)}
})
const User = mongoose.model("User", userSchema)
module.exports = {User}