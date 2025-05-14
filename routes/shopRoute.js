const express = require("express")
const router = express.Router();
const {handleShop, 
    handleAddToCart, 
    handleCart, 
    handleRemoveFromCart, 
    handleAddProduct,
    handleSetItemQuantity
} = require("../controllers/shopController")
const {restrictToLoginnedUserOnly} = require("../middlewares/auth")
router.use(restrictToLoginnedUserOnly)
router.post("/products", handleShop)
router.post("/add_to_cart", handleAddToCart)
router.post("/remove_from_cart", handleRemoveFromCart)
router.get("/cart", handleCart)
router.post("/set_item_quantity", handleSetItemQuantity)
router.post("/add_product", handleAddProduct)
router.post("/place_order", handleAddProduct)

module.exports = router