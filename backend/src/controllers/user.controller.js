const { findUserById, findUsers } = require("../models/user.model");

const getProfile = async (req, res) => {
    const user = req.user;

    res.status(200).json({
        success: true,
        message: 'Get profile successfully',
        data: {
            user
        }
    });
};

const getUser = async (req, res, next) => {
    try {
        if(req.user.role !== 'admin') {
            const error = new Error('User can\'t access this resouces');
            error.statusCode = 403;
            throw(error);
        }

        const userId = req.params.id;
        const user = await findUserById(userId);

        if(!user) {
            const error = new Error('User isn\'t exists');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'Get user successfully',
            data: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        if(req.user.role !== 'admin') {
            const error = new Error('User can\'t access this resouces');
            error.statusCode = 403;
            throw(error);
        }

        const { email, page, limit } = req.query;
        const results = await findUsers(email, page, limit);

        res.status(200).json({
            success: true,
            message: 'Get users successfully',
            data: {
                results
            }
        });
    } catch (error) {
        next();
    }
};

module.exports = {
    getProfile,
    getUser,
    getUsers
};