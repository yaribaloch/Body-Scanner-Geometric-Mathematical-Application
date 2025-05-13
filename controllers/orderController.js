const joi = require("joi")
const {signupValidSchema} = require("../utilities/inputValidation")
// const {generateOTP} = require("../utilities/generateOTP")
// const {sendEmail} = require("../utilities/sendMail")
// const {User} = require("../models/userModel")
async function handlePlaceOrder(req, res) {
try{
    const data = await orderValidSchema.validateAsync(req.body)
    // Stripe payment module
    return res.status(200).json({
        status: true,
        message: "Order placed."
    })
}catch(error){
    console.log(error);
    
}
}
module.exports = {handlePlaceOrder}