const mongoose = require("mongoose")
async function connectMongoDB() {
    return mongoose.connect(process.env.)
}
module.exports = connectMongoDB