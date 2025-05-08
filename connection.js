const mongoose = require("mongoose")
async function connectMongoDB() {    
    return mongoose.connect(process.env.MONGODB_CREDENTIALS)
}
module.exports = connectMongoDB