const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    size: [{
        measure: {
        type: String
        },
        quantity:{
        type: Number
        }
    }],
    brand: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    colors: [{
        type: String,
    }],
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
    },
    createdBy:{
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    }
})
const Product = mongoose.model("Product", productSchema)
module.exports={Product}