const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    userID: {
        ref: "User",
        typeof: mongoose.Schema.types.ObjectId,
    },
    items: [{
        productID: {
            ref: "Product",
            typeof: mongoose.Schema.types.ObjectId,},
        quantity: {
        typeof: Number},
        price: {
        typeof: Number}
    }],
    totalAmount: {
        typeof: Number,
    }
})
const Cart = mongoose.model("Cart", orderSchema)
module.exports=Order