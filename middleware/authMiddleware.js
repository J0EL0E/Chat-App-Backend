const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel.js")
require("dotenv").config();

const authMiddleware = async (req, res, next)  => {

    const headers  = req.headers.authorization;
    let token;
    
    if(headers){
        try{
            token = headers.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = await userModel.findOne({email: decoded.email}).select("-password");
            
            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }

            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        
    }
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }


}

module.exports = authMiddleware;