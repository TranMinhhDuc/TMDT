const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { findUserById } = require('../models/user.model');

const authorize = async (req, res, next) => {
    
    let token;
    try {
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = await findUserById(decoded.userId);
        req.user = user;

        next();
        
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
            error: error.message
        });
    }
}

module.exports = authorize;