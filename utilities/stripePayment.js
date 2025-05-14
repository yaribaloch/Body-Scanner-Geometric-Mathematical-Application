const stripe = require("stripe")

async function makeStripePayment(cart) {
    const lineItems = cart.lineItems.map(item=>{
        {
            price_data:{
                currency: "usd",
                product_data:{
                    name: item.
                }
            }
        }
    })
    const session = stripe.session.create
}

module.exports = {makeStripePayment}