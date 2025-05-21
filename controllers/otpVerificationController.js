const {User} = require("../models/userModel")
const {otpValidSchema} = require("../utilities/inputValidation")
async function handleOTPVerification(req, res) {
    const data = await otpValidSchema.validateAsync(req.body)
    const email = data.email.toLowerCase()
    const user = await User.findOne({otp: data.otp, email:email})
    if(!user)
        return res.status(400).json({
            status: false,
            message: "Invalid OTP."
        })
    //user already verified means request is from Password Reset
    //as verified user can't generate OTP from signup/login
    if(user.verified)
        return res.status(200).json({
        status: true,
        message: "OTP verified."
        })
    //user not verified means request is from signup/login
    await User.updateOne({email:user.email}, {verified:true})
    return res.status(200).json({
        status: true,
        message: "Account verified. Please proceed to login page."
    })
}
module.exports = {handleOTPVerification}