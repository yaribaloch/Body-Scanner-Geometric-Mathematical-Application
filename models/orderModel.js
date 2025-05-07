const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
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
    orderDate: {
        typeof: Date,
    },
    totalAmount: {
        typeof: Number,
    },
    isDelivered: {
        typeof: Boolean,
    },
    deliveredDate: {
        typeof: Date,
    }
})
const Order = mongoose.model("Order", orderSchema)
module.exports=Order