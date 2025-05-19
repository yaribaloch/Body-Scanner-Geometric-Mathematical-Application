const express = require("express")
const router = express.Router();
const {handleShop, 
    handleAddToCart, 
    handleCart, 
    handleRemoveFromCart, 
    handleAddProduct,
    handlePlaceOrder,
    handleSetItemQuantity,
    handlePaymentCancel,
    handlePaymentSuccess
} = require("../controllers/shopController")
const {restrictToLoginnedUserOnly} = require("../middlewares/auth")
router.get("/payment_successful", handlePaymentSuccess)
router.get("/payment_cancel", handlePaymentCancel)
router.use(restrictToLoginnedUserOnly)
router.get("/products", handleShop)
router.post("/add_to_cart", handleAddToCart)
router.post("/remove_from_cart", handleRemoveFromCart)
router.get("/cart", handleCart)
router.post("/set_item_quantity", handleSetItemQuantity)
router.post("/add_product", handleAddProduct)
router.get("/place_order", handlePlaceOrder)

module.exports = router