const {loginValidSchema} = require("../utilities/inputValidation")
const {User} = require("../models/userModel")
const {Product} = require("../models/productModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { default: mongoose } = require("mongoose")
async function handleShop(req, res) {
    const filter = req.query
    const products = await Product.find(filter, {_id:1, type: 1, price:1, rating:1})
    return res
    .staus(300)
    .json({
        status:true,
        pruducs: products
    })

}
async function handleAddToCart(req, res) {
    const userID = req.userID
    const productID = req.query.productID
    const item = Product.findById({_id: ObjectId(productID)}, {_id:1, type:1, rating:1, price:1})
    item.quantity = 1;
    item.calculatedPrice = item.price
    const user = User.findOne({_id: userID})
    user.cart.items.push(item)
    return res
    .staus(300)
    .json({
        status:true,
        pruducs: products
    })

}
async function handleAddProduct(req, res) {
    const userID = req.userID
}
module.exports = {handleShop, handleAddToCart, handleAddProduct}