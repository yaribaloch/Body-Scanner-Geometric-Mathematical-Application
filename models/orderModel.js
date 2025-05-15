const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    items: [{
        productID: {
            ref: "Product",
            type: mongoose.Schema.Types.ObjectId},
        quantity: {
        type: Number},
        price: {
        type: Number}
    }],
    orderDate: {
        type: Date,
        default:Date.now
    },
    totalAmount: {
        type: Number,
    },
    isDelivered: {
        type: Boolean,
    },
    deliveredDate: {
        type: Date,
    }
})
const Order = mongoose.model("Order", orderSchema)
module.exports={Order}