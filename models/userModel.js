const mongoose = require("mongoose")
const { boolean } = require("joi")
const userSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    gender: {
        type: String,
    },
    password: {
        type: String,
    },
    verified: {
        type: Boolean,
    },
    otp: {
        type: String,
    },
    wardrobe: [{
        ref: "Product",
        type: mongoose.Schema.Types.ObjectId,
    }],
    cart:{
        items:[{
            productID: {
                ref: "Product",
                type: mongoose.Schema.Types.ObjectId
            },
            name: {
                type: String
            },
            description: {
                type: String
            },
            imageUrl: {
                type: String,
            },
            quantity: {
                type: Number,
                default: 1
            },
            calculatedPrice: {
                type: Number
            },
            subtotal:{
                type: Number
            },
            shipping:{
                type: Number
            },
            total:{
                type: Number
            }
            }],
        subtotal: {
            type: Number,
        },
        shipping: {
            type: Number,
        },
        total: {
            type: Number,
        },
        
    },
    bodyMeasurements:{
        chest: {
            type: Number,
        },
        waist: {
            type: Number,
        },
        hips: {
            type: Number,
        },
        rise: {
            type: Number,
        },
        length: {
            type: Number,
        },
        lenght2: {
            type: Number,
        },
        outSeam: {
            type: Number,
        },
        inSeam: {
            type: Number,
        },
        crotchDepth: {
            type: Number,
        },
    },
    stylePrefs:{
        bodyType: {
            type: String,
        },
        torsoRatio: {
            type: String,
        },
        armLength: {
            type: String,
        },
        necklne: {
            type: String,
        },
        hemline: {
            type: String,
        },
        fabric: {
            type: String,
        },
        print: {
            type: String,
        },

    },
    fitPrefs:{
        clothingSize: {
            type: String,
        },
        bodyShape: {
            type: String,
        },
        fitted: {
            type: String,
        }
    },
    colorMatching:{
        skinTone: [{
            type: String,
        }],
        personalColorPalette: [{
            type: String,
        }],
        colorPreference: [{
            type: String,
        }]
    },
    settings:{
        personalization: {
            style: {
                type: Boolean,
                default: true
            },
            fit: {
                type: Boolean,
                default: true
            },
            color: {
                type: Boolean,
                default: true
            }
        },
        notifications: {
            personalizedClothingRecomendation: {
                type: Boolean,
                default: false
            },
            saleNotification: {
                type: Boolean,
                default: false
            },
            purchaseNotification: {
                type: Boolean,
                default: false
            }
        },
    }
})

const User = mongoose.model("User", userSchema)
module.exports = {User}