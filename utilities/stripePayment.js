const stripe = require("stripe")(process.env.STRIPE_SECRET)
const axios = require("axios")

async function makeStripePayment(req, res, cart) {
  //data to be stored in order
    const order ={
        items: cart.items.map(itm=>itm),
        userID: req.userID,
        totalAmount: cart.total,
        isDelivered:false,
    }
    const lineItems = cart.items.map(item=>{
        return {
            price_data: {
                currency: "usd",
                product_data: {
                  name: item.name,
                  description: item.description
                },
                unit_amount: Math.round((item.calculatedPrice/item.quantity) *100)
              },
            quantity: item.quantity
        }
    })
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: 'payment',
      line_items: lineItems,
      metadata: {cart: JSON.stringify(order)},
      success_url: "http://localhost:3000/shop/payment_successful?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/shop/payment_cancel",
      shipping_options:[{
        shipping_rate: process.env.STRIPE_SHIPPING_KEY
      }]
    })

    if(!session)
    return res
    .status(500)
    .json({
        status:false,
        message: "Chechout session could not be created.",
    })

    const retrieveSession  = await axios.get(`https://api.stripe.com/v1/checkout/sessions/${session.id}`,{
      auth:{
        username: process.env.STRIPE_SECRET,
        password:''
      }
    })
    if(!retrieveSession)
    return res
    .status(500)
    .json({
        status:false,
        message: "Could not retrieve payment session."
    })

    return res
    .status(300)
    .json({
        status:false,
        message: "!Huhha.. Payment session retrieved.",
        session: retrieveSession.data
    })
}

module.exports = {makeStripePayment}