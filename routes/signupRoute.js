const express = require("express")
const router = express.Router();
const {handleSignUp} = require("../controllers/signupController")

router.post("/",handleSignUp)

module.exports = router