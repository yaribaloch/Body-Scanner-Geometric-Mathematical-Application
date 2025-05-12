const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    size: [{
        measure: {
        type: Number
        },
        quantity:{
        type: Number
        }
    }],
    brand: {
        type: String,
    },
    type: {
        type: String,
    },
    price: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    category: {
        type: String,
    },
    description: {
        type: String,
    }
})
const Product = mongoose.model("Product", productSchema)
module.exports={Product}