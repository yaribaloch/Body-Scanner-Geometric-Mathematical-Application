const {User} = require("../models/userModel")
const bcrypt = require("bcrypt")
const {generateOTP} = require("../utilities/generateOTP")
const {sendEmail} = require("../utilities/sendMail")
const { default: mongoose } = require("mongoose")
const { Order } = require("../models/orderModel")

async function handleReqResetPassword(req, res) {
    const userEmail = req.body.email.toLowerCase()   
    const user =await User.findOne({email: userEmail})
    //check if user missing
    if(!user)
        return res
        .status(500)
        .json({
            status:false,
            message: "No registered account on this email."
        })
        
    const otp = await generateOTP();
    if(!otp)
        return res
        .status(500)
        .json({
            status:false,
            message: "Could not generate OTP."
        })
    user.otp = otp
    const email = sendEmail(userEmail, "Verification OTP", `Please use this OTP: ${otp} to verify you password reset request.`);
    if(!email)
        return res
        .status(500)
        .json({
            status:false,
            message: "Could not send OTP email."
        })
    await user.save()
    return res
    .status(300)
    .json({
        status:true,
        message: "Please check your OTP email, and enter OTP to reset your password."
    })
}
async function handleResetPassword(req, res) {
    const password = req.body.password  
    const confirmPassword = req.body.confirmPassword  
    const userEmail = req.body.email  
    const user =await User.findOne({email: userEmail})
    console.log(req.body);
    
    //check if user missing
    if(!user)
        return res
        .status(500)
        .json({
            status:false,
            message: "No registered account on this email."
        })
    //check if password and confirmPassword are not matched
    if(password!=confirmPassword)
    return res
    .status(500)
    .json({
        status:false,
        message: "Passwords mismatched."
    })
    //encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10)
    user.password = encryptedPassword
    //update user password
    const updatedUser = await user.save()
    return res
    .status(300)
    .json({
        status:true,
        message: "Password updated.",
        user: updatedUser
    })
}
async function handleSetPreferences(req, res) {
    const userID = req.userID
    //get prefrence property name
    const setting= Object.keys(req.body)[0]
    //get prefrence property values
    const preferences= req.body[setting]
    const user =await User.findById({_id:userID})    
    //check if any property value is missing
    if(Object.values(preferences).some(value=>!value))
        return res
        .status(500)
        .json({
            status:false,
            message: "Some fileds are missing"
        })
    //upday prefrence property in user
    user[setting] = preferences
    const updatedUser = await user.save()
    return res
    .status(200)
    .json({
        status:true,
        message: "Your preferences added.",
        user: updatedUser
    })

}
async function handleSetSetting(req, res) {
    const userID = req.userID
    //get prefrence property name
    const setting= Object.keys(req.body)[0]
    //get prefrence property values
    const preferences= req.body[setting]
    const user =await User.findById({_id:userID})    
    //upday prefrence property in user
    user.settings[setting] = preferences
    const updatedUser = await user.save()
    return res
    .status(200)
    .json({
        status:true,
        message: "Your preferences added.",
        user: updatedUser
    })

}
async function handleOrderHistory(req, res) {
    const userID = req.userID
    const user  =await User.findById(userID).populate("orders");
    const orders = user.orders
    if(!orders)
    return res
    .status(500)
    .json({
        status:false,
        message: ".Naana!! Empty order history.",
    })

    return res
    .status(300)
    .json({
        status:true,
        message: "!Woof.. Found good order history..",
        orders: orders
    })

}

module.exports = {
    handleReqResetPassword,
    handleResetPassword,
    handleSetPreferences,
    handleSetSetting,
    handleOrderHistory
}