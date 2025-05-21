const {loginValidSchema} = require("../utilities/inputValidation")
const {User} = require("../models/userModel")
const {Product} = require("../models/productModel")
const {Order} = require("../models/orderModel")
const {makeStripePayment} = require("../utilities/stripePayment")
const stripe = require("stripe")(process.env.STRIPE_SECRET)
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { default: mongoose } = require("mongoose")
const { default: Stripe } = require("stripe")
async function handleShop(req, res) {
    const filter = req.query
    const products = await Product.find(filter, {_id:1, type: 1, price:1, rating:1})
    return res
    .status(300)
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
        name: product.name,
        description: product.description,
        imageUrl:product.imageUrl,
        quantity:1,
        calculatedPrice: product.price
    })
        
    //calculate and set cart price
    calculateCartPrice(user)
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
    //calculate and set cart price
    calculateCartPrice(user)

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
        name: product.name,
        description: product.description,
        quantity: quantity,
        calculatedPrice: product.price * quantity
    }
    //update item
    const newItems = user.cart.items.map(itm=>itm.productID==productID?item:itm)
    user.cart.items=newItems
    
    //calculate and set cart price
    calculateCartPrice(user)
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
}
async function handlePlaceOrder(req, res) {
    const userID = req.userID
    const user = await User.findById({_id: userID})
    const cart = user.cart
   if(!cart)
        return res
        .status(400)
        .json({
            status:false,
            message: "Cann't place order for an empty cart."
        })
    makeStripePayment(req, res, cart);
}
async function calculateCartPrice(user) {
        //reset shipping when no item in cart
        const shipping = user.cart.items.length>0? parseFloat(process.env.SHIPPING_PRICE) : 0.00
        //reset subtotal
        user.cart.subtotal =0.00
        //recalculate prices
        user.cart.items.forEach(item => {
            user.cart.subtotal += item.calculatedPrice
        });
        user.cart.shipping =  shipping
        user.cart.total =  shipping + user.cart.subtotal
}
async function handlePaymentSuccess(req, res) {
    const sessionID = req.query.session_id
    const retrievedSession = await stripe.checkout.sessions.retrieve(sessionID);
    const orderData = JSON.parse(retrievedSession.metadata.order)
    const user = await User.findById({_id: orderData.userID})

    const order = new Order(orderData)
    const newOrder = await order.save();
    user.orders.push(newOrder._id)
    const savedUser =await user.save()
    if(!savedUser || !newOrder)
    return res
        .status(400)
        .json({
            status:false,
            message: "!Ufff.. Order could not be saved.",
            order: newOrder
        })
    return res
        .status(300)
        .json({
            status:true,
            message: "!WOAOW.. Payment done, order placed.",
            order: newOrder
        })
}
async function handlePaymentCancel(req, res) {
    return res
        .status(500)
        .json({
            status:false,
            message: ".OOPS!! Payment canceled, order also."
        })
}

module.exports = {handleShop, 
    handleAddToCart, 
    handleAddProduct, 
    handleRemoveFromCart, 
    handleCart,
    handlePlaceOrder,
    handleSetItemQuantity,
    handlePaymentSuccess,
    handlePaymentCancel
}