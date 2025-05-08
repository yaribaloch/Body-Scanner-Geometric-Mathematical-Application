const express = require("express")
const router = express.Router();
const {restrictToLoginnedUserOnly} = require("../middlewares/auth")
const {handlePlaceOrder} = require("../controllers/orderController")

router.post("/", restrictToLoginnedUserOnly, handlePlaceOrder)

module.exports = router