const dbConnection = require("../config/dbConnection");

const {
    getReviewsByProductId,
    createOneReview,
    deleteOneReview
} = require("../models/review.model");

const getReview = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const { page, limit } = req.query;

        const parsedPage = parseInt(page) || 1;
        const parsedLimit = parseInt(limit) || 10;

        const offset = parsedLimit * (parsedPage - 1);
        const { reviews, totalPage, totalItem } = await getReviewsByProductId(productId, offset, parsedLimit);

        res.status(200).json({
            success: true,
            message: 'Get review successfully',
            data: {
                reviews,
                totalPage,
                totalItem,
                limit: parsedLimit,
                currentPage: parsedPage,
            }
        });
    } catch (error) {
        next(error);
    }
};

const createReview = async (req, res, next) => {
    const connection = await dbConnection.getConnection();
    await connection.beginTransaction();

    try {
        const { productId, comment } = req.body;
        
        if (!productId || !comment) {
            const error = new Error('Product ID and comment are required');
            error.statusCode = 400;
            throw error;
        }

        const userId = req.user.userId;

        const isCreated = await createOneReview(userId, productId, comment, connection);

        if (!isCreated) {
            const error = new Error('Create review failed');
            error.statusCode = 500;
            throw error;
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Create review successfully'
        });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};

const deleteReview = async (req, res, next) => {
    const connection = await dbConnection.getConnection();
    await connection.beginTransaction();

    try {
        const reviewId = req.params.id;
        
        if (!reviewId) {
            const error = new Error('Review ID is required');
            error.statusCode = 400;
            throw error;
        }

        const userId = req.user.userId;

        console.log(userId);
        const isDeleted = await deleteOneReview(userId, reviewId, connection);

        if (!isDeleted) {
            const error = new Error('Delete review failed');
            error.statusCode = 500;
            throw error;
        }

        await connection.commit();

        res.status(200).json({
            success: true,
            message: 'Delete review successfully'
        });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};

module.exports = {
    getReview,
    createReview,
    deleteReview
};