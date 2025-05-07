const joi = require("joi")
const {signupValidSchema} = require("../utilities/inputValidation")
const User = require("../models/userModel")
async function handleSignUp(req, res) {
try{
    const data = signupValidSchema.validateAsync(req.body)
    const user = await User.findOne({email: data.email})
    if(user){
        if(user.verified) return res.status(400).json({
            status: false,
            message: "Account already exists, please login."
        })

        const otp = generateOTP();
        if(!otp) return res.status(500).json({
            status: false,
            message: "Could not generate. Please try again."
        })

        const email = sendEmail("OTP Verification", `Your OTP for BSGMA is ${otp}. Please use this OTP to verify yout BSGMA account.`, data.email)
        if(!email) return res.status(500).json({
            status: false,
            message: "Could not send OTP email. Try again later."
        })

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
    const otp = generateOTP();
    if(!otp) return res.status(500).json({
        status: false,
        message: "Could not generate. Please try again."
    })

    const email = sendEmail("OTP Verification", `Your OTP for BSGMA is ${otp}. Please use this OTP to verify yout BSGMA account.`, data.email)
    if(!email) return res.status(500).json({
        status: false,
        message: "Could not send OTP email. Try again later."
    })
    const newUser = new User({
        email:data.email,
        gender:data.gender,
        password:data.password,
        confirmPassword:data.confirmPassword,
        verified:false,
        otp:otp
    })
    const userSaved = await newUser.save();

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