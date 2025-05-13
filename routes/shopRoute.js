const express = require("express")
const router = express.Router();
const {handleShop, handleAddToCart, handleRemoveFromCart, handleAddProduct} = require("../controllers/shopController")
const {restrictToLoginnedUserOnly} = require("../middlewares/auth")
router.use(restrictToLoginnedUserOnly)
router.post("/products", handleShop)
router.post("/add_to_cart", handleAddToCart)
router.post("/remove_from_cart", handleRemoveFromCart)
router.post("/add_product", handleAddProduct)

module.exports = router