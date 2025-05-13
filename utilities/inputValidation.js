const Joi= require("joi")
const signupValidSchema = Joi.object({
    email: Joi.string().email(),
    gender: Joi.string().min(4),
    contact: Joi.number().optional(),
    password: Joi.string(),
    confirmPassword: Joi.string(),
})
const orderValidSchema = Joi.object({
    items: Joi.array().items(Joi.object().required)
})
const loginValidSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string()
})
const otpValidSchema = Joi.object({
    otp: Joi.string(),
    email: Joi.string().email(),
})
module.exports={signupValidSchema, otpValidSchema, loginValidSchema, orderValidSchema}