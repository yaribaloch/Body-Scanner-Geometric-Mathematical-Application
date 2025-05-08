const joi = require("joi")
const {signupValidSchema} = require("../utilities/inputValidation")
const {generateOTP} = require("../utilities/generateOTP")
const {sendEmail} = require("../utilities/sendMail")
const {User} = require("../models/userModel")
async function handleSignUp(req, res) {
try{
    const data = await signupValidSchema.validateAsync(req.body)    
    const user = await User.findOne({email: data.email})    
    console.log(data);
        
    if(user){
        if(user.verified) return res.status(400).json({
            status: false,
            message: "Account already exists, please login."
        })

        const otp = await generateOTP();
        if(!otp) return res.status(500).json({
            status: false,
            message: "Could not generate. Please try again."
        })

        const email = sendEmail(data.email, "OTP Verification", `Your OTP for BSGMA is ${otp}. Please use this OTP to verify yout BSGMA account.`)
        console.log(email);
        
        if(!email) return res.status(500).json({
            status: false,
            message: "Could not send OTP email. Try again later."
        })
        await User.updateOne({email: user.email}, {otp:otp})
        return res.status(200).json({
            status: false,
            message: "Please check email to verify your account."
        })
    }
    if(data.password!==data.confirmPassword)
        return res.status(300).json({
            status: false,
            message: "Passwords mismatched. Please give same password."
        })
    const otp = await generateOTP();
    if(!otp) return res.status(500).json({
        status: false,
        message: "Could not generate. Please try again."
    })

    const email = sendEmail(data.email, "OTP Verification", `Your OTP for BSGMA is ${otp}. Please use this OTP to verify yout BSGMA account.`)
    console.log(email);
    
    if(!email) return res.status(500).json({
        status: false,
        message: "Could not send OTP email. Try again later."
    })
    console.log(data);
    
    const newUser = new User({
        email: data.email,
        gender: data.gender,
        password: data.password,
        verified: false,
        otp: otp
    })
    
    const userSaved = await newUser.save();
    console.log(userSaved);

    if(!userSaved)
    return res.status(500).json({
        status: false,
        message: "Could not create account. Please try again."
    })

    return res.status(200).json({
        status: false,
        message: "Account created. Please check email to verify your account."
    })
}catch(error){
    console.log(error);
    
}
}
module.exports = {handleSignUp}