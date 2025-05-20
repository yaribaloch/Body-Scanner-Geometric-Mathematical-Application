const {loginValidSchema} = require("../utilities/inputValidation")
const {User} = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
async function handleLogin(req, res) {
    const data = await loginValidSchema.validateAsync(req.body)
    const user = await User.findOne({email: data.email})    
    if(!user)
        return res.status(400).json({
            status: false,
            message: "User not found. Please signup."
        })

    if(!user.verified){
        const otp = await generateOTP();
        if(!otp) return res.status(500).json({
            status: false,
            message: "Could not generate OTP. Please try again."
        })

        const email = sendEmail(user.email, "OTP Verification", `Your OTP for BSGMA is ${otp}. Please use this OTP to verify yout BSGMA account.`)        
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
    bcrypt.compare( data.password, user.password, (error, result)=>{
        if(error)
            return res.status(400).json({
                status: false,
                error: error
            })
        if(!result)
            return res.status(400).json({
                status: false,
                message: "Wrong Password. Please enter password again."
            })
        const accessToken = jwt.sign({userID: user._id}, process.env.JWT_KEY)
        return res.status(200).json({
            status: true,
            message: "You are logged in.",
            token: accessToken
        })

    })
}

module.exports = {handleLogin}