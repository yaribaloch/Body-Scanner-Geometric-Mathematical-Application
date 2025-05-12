const express = require("express")
const router = express.Router();
const {handleShop, handleAddToCart, handleAddProduct} = require("../controllers/loginController")

router.post("/products", handleShop)
router.post("/add_to_cart", handleAddToCart)
router.post("/add_product", handleAddProduct)

module.exports = router