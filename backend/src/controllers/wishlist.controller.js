const dbPool = require("../config/dbConnection");

const { findWishList, createOneWishList, deleteOneWishList } = require("../models/wishList.model");
const { findProduct } = require("../models/product.model");

const getWishList = async (req, res, next) => {
    try {
        const user = req.user;
        const { page, limit } = req.query;

        const parsedPage = parseInt(page) || 1;
        const parsedLimit = parseInt(limit) || 10;

        const offset = parsedLimit * (parsedPage - 1);
        const { wishLists, totalPage, totalItem } = await findWishList(user.userId, offset, parsedLimit);

        res.status(200).json({
            success: true,
            message: 'Get wish list successfully',
            data: {
                wishLists,
                totalPage,
                totalItem,
                currentPage: parsedPage,
            }
        });
    } catch (error) {
        next(error);
    }
};

const createWishList = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();
    
    try {
        const user = req.user;
        const { productId } = req.body;

        if (!productId) {
            const error = new Error('Product ID is required');
            error.statusCode = 400;
            throw error;
        }

        const product = await findProduct(productId);

        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        const { wishLists } = await findWishList(user.userId, 0, 10);
        console.log(wishLists);
        wishLists.forEach((wishList) => {
            if ( wishList.productId === productId ) {
                const error = new Error('Product already exists in wish list');
                error.statusCode = 400;
                throw error;
            }
        });

        const result = await createOneWishList(user.userId, productId, connection);
        if (!result) {
            const error = new Error('Failed to add product to wish list');
            error.statusCode = 500;
            throw error;
        }

        await connection.commit();
        connection.release();
        
        res.status(201).json({
            success: true,
            message: 'Product added to wish list successfully',
        });
    } catch (error) {
        await connection.rollback();
        connection.release();
        next(error);
    }

};

const deleteWishList = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        const user = req.user;
        const wishListId = req.params.id;

        if (!wishListId) {
            const error = new Error('Wish list ID is required');
            error.statusCode = 400;
            throw error;
        }
        
        const result = await deleteOneWishList(user.userId, wishListId, connection);
        if(!result) {
            const error = new Error('Failed to delete product to wish list');
            error.statusCode = 500;
            throw error;
        }

        await connection.commit();
        connection.release();
        
        res.status(200).json({
            success: true,
            message: 'Product removed from wish list successfully',
        });
    } catch (error) {
        await connection.rollback();
        connection.release();
        next(error);
    }
}

module.exports = {
    getWishList,
    createWishList,
    deleteWishList
}
