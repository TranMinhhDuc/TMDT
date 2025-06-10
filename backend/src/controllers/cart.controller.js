const dbPool = require('../config/dbConnection');
const { findCart, createOneCart, updateOneCartItem, deleteOneCartItem, findCartByVariantId, findCartItemById } = require("../models/cart.model");

const getCart = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const cart = await findCart(userId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        console.log(cart);
        let totalPrice = 0;
        cart.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        res.status(200).json({
            status: "success",
            message: "Cart retrieved successfully",
            data: {
                cart,
                totalPrice
            }
        });
    } catch (error) {
        next(error);
    }
};

const createCartItem = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        console.log(req.user);
        const userId = req.user.userId;
        const { productVariantId, quantity } = req.body;
        
        const existsCartItem = await findCartByVariantId(userId, productVariantId);
        if (existsCartItem !== null) {
            if (existsCartItem.length > 0) {
                return res.status(400).json({ message: "Product variant already exists in the cart" });
            }
        }

        if (!productVariantId || !quantity) {
            return res.status(400).json({ message: "Product variant ID and quantity are required" });
        }

        const cartItem = await createOneCart(userId, productVariantId, quantity, connection);

        await connection.commit();
        res.status(201).json({
            status: "success",
            message: "Cart item created successfully",
            data: {
                cartItem
            }
        });

    } catch (error) {
        await connection.rollback();
        connection.release();
        next(error);
    } finally{
        if (connection) {
            connection.release();
        }
    }
};

const updateCartItem = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        const cartItemId = req.params.id;
        const { quantity } = req.body;

        if (!quantity) {
            return res.status(400).json({ message: "Quantity is required" });
        }

        const updatedCartItem = await updateOneCartItem(cartItemId, quantity, connection);

        if (!updatedCartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        await connection.commit();
        res.status(200).json({
            status: "success",
            message: "Cart item updated successfully",
        });

    } catch (error) {
        await connection.rollback();
        next(error);
    }
};

const deleteCartItem = async (req, res, next) => {
    let connection;
    try {
        connection = await dbPool.getConnection();
        await connection.beginTransaction();

        const cartItemId = req.params.id;
        const { cartId } = req.body;

        if (!cartId) {
            return res.status(400).json({ message: "Cart ID is required" });
        }

        if (!cartItemId) {
            return res.status(400).json({ message: "Cart item ID is required" });
        }

        const existsCartItem = await findCartItemById(cartItemId);
        if (!existsCartItem || existsCartItem.length === 0) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        const deletedCartItem = await deleteOneCartItem(cartId, cartItemId, connection);

        if (!deletedCartItem) {
            throw new Error("Failed to delete cart item");
        }

        await connection.commit();

        return res.status(200).json({
            status: "success",
            message: "Cart item deleted successfully",
        });
    } catch (error) {
        if (connection) await connection.rollback();
        next(error);
    } finally {
        if (connection) connection.release();
    }
};


module.exports = {
    getCart,
    createCartItem,
    updateCartItem,
    deleteCartItem
};