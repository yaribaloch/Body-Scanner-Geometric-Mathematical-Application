const {loginValidSchema} = require("../utilities/inputValidation")
const {User} = require("../models/userModel")
const {Product} = require("../models/productModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {generateOTP} = require("../utilities/generateOTP")
const {sendEmail} = require("../utilities/sendMail")
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
            quantity:1,
            calculatedPrice: product.price
        })
        //recalculate prices
        user.cart.subtotal =0.00
        user.cart.items.forEach(item => {
            user.cart.subtotal += item.calculatedPrice
        });
        user.cart.shipping =  process.env.SHIPPING_PRICE
        user.cart.total =  parseFloat(process.env.SHIPPING_PRICE) + user.cart.subtotal
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
    const item = user.cart.items.find(itm=>itm.productID==data.productID)    
    user.cart.items.pull(item)
    //zero shipping when no item in cart
    const shipping = user.cart.items.length>0? parseFloat(process.env.SHIPPING_PRICE) : 0.00
    //reset subtotal
    user.cart.subtotal =0.00
    //recalculate prices
    user.cart.items.forEach(item => {
        user.cart.subtotal += item.calculatedPrice
    });
    user.cart.shipping =  shipping
    user.cart.total =  shipping + user.cart.subtotal

    const savedUser = await user.save()
    return res
        .status(300)
        .json({
            status:true,
            message: "Item removed from the cart.",
            savedUser: savedUser
        })
}
async function handleCart(req, res) {
    const userID = req.userID
    const user =await User.findOne({_id: userID})   
    //check if userID, user or item missing
    if(!userID || !user)
        return res
        .status(500)
        .json({
            status:false,
            message: userID? "Looks like you are logged out.": "Could not access user."
        })
        
    const cart = user.cart
    //check if cart is empty
    if(cart.items.length==0)
    return res
        .status(500)
        .json({
            status:false,
            message: "Cart is empty."
        })
    return res
        .status(300)
        .json({
            status:true,
            message: "Cart.",
            cart: cart
        })
}
async function handleSetItemQuantity(req, res) {
    const userID = req.userID
    const user =await User.findOne({_id: userID})   
    const {productID, quantity} = req.body
    const product = await Product.findById({_id: productID})
    //check if userID or user missing
    if(!userID || !user)
        return res
        .status(500)
        .json({
            status:false,
            message: userID? "Looks like you are logged out.": "Could not access user."
        })
    if(!product)
        return res
        .status(500)
        .json({
            status:false,
            message:"Looks like product is out of stock."
        })
    if(quantity<=0)
        return res
        .status(500)
        .json({
            status:false,
            message:"Minimum quantity should be one."
        })
    
    const item = {
        productID: productID,
        imageUrl: product.imageUrl,
        quantity: quantity,
        calculatedPrice: product.price * quantity
    }
    //update item
    console.log("items: ", product);
    const newItems = user.cart.items.map(itm=>itm.productID==productID?item:itm)
    user.cart.items=newItems
    console.log("new items: ", newItems);
    
    //conditional shipping
    const shipping = parseFloat(process.env.SHIPPING_PRICE)
    //recalculate prices
    user.cart.subtotal =0.00
    user.cart.items.forEach(itm => {
        user.cart.subtotal += itm.calculatedPrice
    });
    user.cart.total = shipping + user.cart.subtotal
    const updatedUser = await user.save()
    return res
        .status(300)
        .json({
            status:true,
            message: "Cart altered.",
            user: updatedUser
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
async function handlePlaceOrder(req, res) {
    const userID = req.userID
    const cart = req.body.cart
   if(!cart)
        return res
        .status(400)
        .json({
            status:false,
            message: "Cann't place order over empty cart."
        })    
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
module.exports = {handleShop, 
    handleAddToCart, 
    handleAddProduct, 
    handleRemoveFromCart, 
    handleCart,
    handleSetItemQuantity
}