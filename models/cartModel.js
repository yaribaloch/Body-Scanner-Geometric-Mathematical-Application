const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    userID: {
        ref: "User",
        type: mongoose.Schema.types.ObjectId,
    },
    items: [{
        productID: {
            ref: "Product",
            type: mongoose.Schema.types.ObjectId,},
        quantity: {
        type: Number},
        price: {
        type: Number}
    }],
    totalAmount: {
        type: Number,
    }
})
const Cart = mongoose.model("Cart", orderSchema)
module.exports=Order