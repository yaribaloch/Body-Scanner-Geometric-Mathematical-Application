const otpgenerator = require("otp-generator")
async function generateOTP() {
    const otp = otpgenerator.generate(6, {
        lowerCaseAlphabets: false,
        specialCharacter: false
    })
    return otp
}

module.exports={generateOTP}