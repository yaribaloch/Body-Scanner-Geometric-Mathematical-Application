const {User} = require("../models/userModel")
const {otpValidSchema} = require("../utilities/inputValidation")
async function handleOTPVerification(req, res) {
    const data = await otpValidSchema.validateAsync(req.body)
    console.log(data.otp);
    
    const user = await User.findOne({otp: data.otp})
    if(!user)
        return res.status(400).json({
            status: false,
            message: "Invalid OTP."
        })

    await User.updateOne({email:user.email}, {verified:true})
    return res.status(200).json({
        status: true,
        message: "Account verified. Please proceed to login page."
    })
}
module.exports = {handleOTPVerification}