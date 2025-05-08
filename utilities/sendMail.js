const nodemailer = require("nodemailer")
async function sendEmail(recipient, subject, html) {
    const transport = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth:{
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_PASS
        }
    })

    const mailOptions = {
        from: process.env.BREVO_EMAIL,
        to: recipient,
        subject: subject,
        text:  html.replace(/<[^>]+>/g, ""),
        html:html
    }

    try{
        const info = await transport.sendMail(mailOptions)
        if(info) return true
    }catch(error){
        console.log("Error sending email", error);
        return false
    }
}

module.exports = {sendEmail}