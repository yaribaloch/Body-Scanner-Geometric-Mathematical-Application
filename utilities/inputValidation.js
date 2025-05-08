const Joi= require("joi")
const signupValidSchema = Joi.object({
    email: Joi.string().email(),
    gender: Joi.string().min(4),
    contact: Joi.number().optional(),
    password: Joi.string(),
    confirmPassword: Joi.string(),
})
const loginValidSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string()
})
const otpValidSchema = Joi.object({
    otp: Joi.string(),
})
module.exports={signupValidSchema, otpValidSchema, loginValidSchema}