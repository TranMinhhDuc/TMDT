const dbPool = require('../config/dbConnection');
const { findUserByEmail, createUser } = require('../models/user.model');
const generateToken = require('../utils/token.util');
const bcrypt = require('bcrypt');

const signUp = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    try {
        connection.beginTransaction();
        const { email, password } = req.body;
        
        const existsEmail = await findUserByEmail(email);
        if (existsEmail) {
            const error = new Error('This Email already exists');
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await createUser(email, hashedPassword, connection);
        const token = generateToken(user.userId);

        connection.commit();
        res.status(201).json({
            success: true,
            message: "Sign up successfully",
            data: {
                user,
                token
            }
        });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const user = await findUserByEmail(email);
        if (user.length === 0) {
            const error = new Error('Email or password is incorrect');
            error.statusCode = 404;
            throw error;
        }
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if(!isMatchPassword) {
            const error = new Error('Email or password is incorrect');
            error.statusCode = 404;
            throw error;
        }

        const token = generateToken(user.userId);

        res.status(200).json({
            success: true,
            message: 'Login successfully',
            data:{
                user,
                token
            }
        });

    }catch (error) {
        next(error)
    }
};

module.exports = {
    signUp,
    signIn
}
