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
    const user =await User.findOne({_id: userID})
    const item = req.body
    //check if userID, user or item missing
    if(!userID || !user || !item)
        return res
        .status(500)
        .json({
            status:false,
            message: user? "Looks like you are logged out.": "Please select an item to put in cart."
        })
    //check if product actually exists
    const checkProduct = await Product.exists({_id: item.productID})
    if(!checkProduct)
        return res
        .status(500)
        .json({
            status:false,
            message:"Opps, ivalid product ID."
        })
    //check if item is already in cart
    if(user.cart.items.some(itm=> itm.productID.equals(item.productID)))
        return res
        .status(500)
        .json({
            status:false,
            message:"Item already in cart."
        })
        //push new product into cart items
        user.cart.items.push({
            productID: item.productID,
            imageUrl:item.imageUrl,
            quantity:item.quantity,
            calculatedPrice: item.price
        })
        //adding price of the new item to the subtotal of cart
        user.cart.subtotal += item.price
        user.cart.shipping = process.env.SHIPPING_PRICE
        user.cart.total += item.price+ parseFloat(process.env.SHIPPING_PRICE)
    const savedUser = await user.save()
    return res
        .status(300)
        .json({
            status:true,
            message: "Item added to the cart.",
            savedUser: savedUser
        })
}
async function handleRemoveCart(req, res) {
    const userID = req.userID
    const user =await User.findOne({_id: userID})
    const item = req.body
    const product = await Product.findOne({_id: item.productID})
    //check if userID, user or item missing
    if(!userID || !user || !item)
        return res
        .status(500)
        .json({
            status:false,
            message: userID? "Looks like you are logged out.": "Please select an item to remove from cart."
        })
    //check if product actually exists in cart
    if(!user.cart.items.some(itm=> itm.productID.equals(item.productID)))
        return res
        .status(500)
        .json({
            status:false,
            message:"Item not in the cart."
        })
    //pull the product from cart items
    user.cart.items= user.cart.items.filter(item=>{item.productID.equals(product.productID)})
    //adding price of the new item to the subtotal of cart
    user.cart.subtotal -= product.price
    user.cart.shipping = process.env.SHIPPING_PRICE
    user.cart.total -= (item.price+ parseFloat(process.env.SHIPPING_PRICE))
    const savedUser = await user.save()
    return res
        .status(300)
        .json({
            status:true,
            message: "Item added to the cart.",
            savedUser: savedUser
        })
}
async function handleAddProduct(req, res) {
    const userID = req.userID
    const products = req.body
    if(Array.isArray(products)){
        for(const product of products){
            const newProduct = new Product({
                size: product.size,
                brand: product.brand,
                name: product.name,
                colors: product.colors,
                price: product.price,
                rating: product.rating,
                category: product.category,
                description: product.description,
                createdBy: userID})
                const savedProduct = await newProduct.save()
                if(!savedProduct)
                    return res
                    .staus(400)
                    .json({
                        status:false,
                        message: "Couldn't save the Product.",
                        product: product
                    })
        }
        return res
        .status(300)
        .json({
            status:true,
            message: "Products saved successfuly."
        })
    }
    return res
        .status(500)
        .json({
            status:false,
            message: "Array of products expected."
        })
    // const { size,brand,type, colors,price,rating,category,description} = req.body

    // const newProduct = new Product({
        
    // size: size,
    // brand: brand,
    // type: type,
    // colors: colors,
    // price: price,
    // rating: rating,
    // category: category,
    // description: description,
    // createdBy: userID})
    // const savedProduct = await newProduct.save()
    // if(!savedProduct)
    //     return res
    //     .staus(400)
    //     .json({
    //         status:false,
    //         message: "Couldn't save the Product."
    //     })

    // return res
    // .status(300)
    // .json({
    //     status:true,
    //     message: "Product saved successfuly.",
    //     newProduct: savedProduct
    // })
}
module.exports = {handleShop, handleAddToCart, handleAddProduct}