const jwt = require("jsonwebtoken")

async function restrictToLoginnedUserOnly(req, res, next) {
    const token = req.header("Authorization") || req.header("authorization")

    if(!token)
        return res.status(400).json({
            status: true,
            message: "Please login."
        })

    const decodedToken = jwt.verify(token.split(" ")[1], process.env.JWT_KEY)
    req.userID = decodedToken.userID;
    console.log(decodedToken);
    
    next();
}
module.exports = {restrictToLoginnedUserOnly}