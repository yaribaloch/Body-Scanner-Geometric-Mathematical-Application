const joi = require("joi")
const {signupValidSchema} = require("../utilities/inputValidation")
const {generateOTP} = require("../utilities/generateOTP")
const bcrypt = require("bcrypt")

const {sendEmail} = require("../utilities/sendMail")
const {User} = require("../models/userModel")
async function handleSignUp(req, res) {
try{
    const data = await signupValidSchema.validateAsync(req.body)
    const lowerCaseEmail = data.email.toLowerCase()  
    const user = await User.findOne({email: lowerCaseEmail})    
        
    if(user){
        if(user.verified) return res.status(400).json({
            status: false,
            message: "Account already exists, please login."
        })

        const otp = await generateOTP();
        if(!otp) return res.status(500).json({
            status: false,
            message: "Could not generate OTP. Please try again."
        })

        const email = sendEmail(lowerCaseEmail, "OTP Verification", `Your OTP for BSGMA is ${otp}. Please use this OTP to verify yout BSGMA account.`)
        
        if(!email) return res.status(500).json({
            status: false,
            message: "Could not send OTP email. Try again later."
        })
        await User.updateOne({email: lowerCaseEmail}, {otp:otp})
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

    const email = sendEmail(lowerCaseEmail, "OTP Verification", `Your OTP for BSGMA is ${otp}. Please use this OTP to verify yout BSGMA account.`)
    
    if(!email) return res.status(500).json({
        status: false,
        message: "Could not send OTP email. Try again later."
    })
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const newUser = new User({
        email: lowerCaseEmail,
        gender: data.gender,
        password: hashedPassword,
        verified: false,
        otp: otp,
        cart:{
            items:[
                // {
                // productID:0.0,
                // imageUrl: 0.0,
                // quantity:0.0,
                // calculatedPrice:0.0,
                // subtotal:0.0,
                // shipping:0.0,
                // total:0.0,
                // }
            ],
            subtotal:0.00,
            shipping:0.00,
            total:0.00,  
            },
        bodyMeasurements:{
            chest:0.0,
            waist:0.0,
            hips:0.0,
            rise:0.0,
            length:0.0,
            lenght2:0.0,
            outSeam:0.0,
            inSeam:0.0,
            crotchDepth:0.0,
        },
        stylePrefs:{
            bodyType:0.0,
            torsoRatio:0.0,
            armLength:0.0,
            necklne:0.0,
            hemline: 0.0,
            fabric:0.0,
            print:0.0,
        },
        fitPrefs:{
            clothingSize:0.0,
            bodyShape:0.0,
            fitted:0.0
        },
        colorMatching:{
            skinTone:0.0,
            personalColorPalette:0.0,
            colorPreference:0.0
        },
        settings:{
            personalization: {
                style:0,
                fit:0,
                color:0,
            },
            notifications: {
                personalizedClothingRecomendation: 0,
                saleNotification:0,
                purchaseNotification:0
            },
        }
    })
    
    const userSaved = await newUser.save();
    console.log(userSaved);

    if(!userSaved)
    return res.status(500).json({
        status: false,
        message: "Could not create account. Please try again."
    })

    return res.status(200).json({
        status: true,
        message: "Account created. Please check email to verify your account."
    })
}catch(error){
    console.log(error);
    
}
}
module.exports = {handleSignUp}