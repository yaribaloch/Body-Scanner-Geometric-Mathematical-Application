const express = require("express")
const router = express.Router();
const {handleOTPVerification} = require("../controllers/otpVerificationController")

router.post("/",handleOTPVerification)

module.exports = router