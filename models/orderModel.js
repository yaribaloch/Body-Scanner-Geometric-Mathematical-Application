const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    userID: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
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
module.exports=Order