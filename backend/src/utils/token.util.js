const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN});
    return token;
};

module.exports = generateToken;