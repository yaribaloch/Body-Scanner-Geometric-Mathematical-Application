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
    const data = req.body
    //check if product actually exists
    const product = await Product.findById({_id: data.productID})
    
    if(!product)
        return res
        .status(500)
        .json({
            status:false,
            message:"Opps, ivalid product ID."
        })    
    //check if userID, user or item missing
    if(!userID || !user || !product)
        return res
        .status(500)
        .json({
            status:false,
            message: user? "Looks like you are logged out.": "Please select an item to put in cart."
        })

    //check if item is already in cart    
    if(user.cart.items.some(itm=> itm.productID.equals(product._id)))
        return res
        .status(500)
        .json({
            status:false,
            message:"Item already in cart."
        })
        //push new product into cart items
        user.cart.items.push({
            productID: product._id,
            imageUrl:product.imageUrl,
            quantity:data.quantity,
            calculatedPrice: product.price
        })
        //adding price of the new item to the subtotal of cart
        user.cart.subtotal += product.price
        user.cart.shipping = process.env.SHIPPING_PRICE
        if(user.cart.items.length==1){
            user.cart.total += (product.price+ parseFloat(process.env.SHIPPING_PRICE))
        }else{
            user.cart.total += product.price
        }
    const savedUser = await user.save()
    return res
        .status(300)
        .json({
            status:true,
            message: "Item added to the cart.",
            savedUser: savedUser
        })
}
async function handleRemoveFromCart(req, res) {
    const userID = req.userID
    const user =await User.findOne({_id: userID})
    const data = req.body
    const product = await Product.findById({_id: data.productID})
    if(!product)
        return res
        .status(500)
        .json({
            status:false,
            message:"Opps, ivalid product ID."
        })    
    //check if userID, user or item missing
    if(!userID || !user || !data)
        return res
        .status(500)
        .json({
            status:false,
            message: userID? "Looks like you are logged out.": "Please select an item to remove from cart."
        })
    //check if product actually exists in cart
    if(!user.cart.items.some(itm=> itm.productID.equals(data.productID)))
        return res
        .status(500)
        .json({
            status:false,
            message:"Item not in the cart."
        })
    //pull the product from cart items
    user.cart.items= user.cart.items.filter(item=>{return !item.productID.equals(product.productID)})
    //adding price of the new item to the subtotal of cart
    user.cart.subtotal -= product.price
    user.cart.shipping = process.env.SHIPPING_PRICE
    if(user.cart.items.length==0){    
        user.cart.total -= (product.price+ parseFloat(process.env.SHIPPING_PRICE))
    }else{
        user.cart.total -= (product.price)
    }
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
module.exports = {handleShop, handleAddToCart, handleAddProduct, handleRemoveFromCart}