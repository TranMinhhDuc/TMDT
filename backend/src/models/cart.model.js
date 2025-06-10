const dbPool = require('../config/dbConnection');

const findCartByUserId = async (userId) => {
    try {
        const query = `
            SELECT * FROM cart where userId = ?;
        `;

        const [ cart ] = await dbPool.query(query, [userId]);
        console.log(query);

        return cart;
    } catch (error) {
        console.error("Error finding cart by userId:", error);
        throw error;
    }
};

const findCartByVariantId = async (userId, productVariantId) => {
    try {
        const cart = await findCartByUserId(userId);
        
        if (cart.length === 0) {
            return null;
        }
        const cartId = cart[0].cartId;
        const query = `
            SELECT * FROM cartitem WHERE cartId = ? AND productVariantId = ?;
        `;

        const [ cartItem ] = await dbPool.query(query, [cartId, productVariantId]);
        console.log(query);

        return cartItem;
    } catch (error) {
        console.error("Error finding cart by variant ID:", error);
        throw error;
        
    }
};

const findCart = async (userId) => {
    try {
        const query = `
            SELECT c.cartId, ci.cartItemId, ci.quantity, ci.productVariantId, v.color, v.size, p.name, p.price,
                (SELECT i.path FROM images i WHERE i.productId = p.productId LIMIT 1) AS 'path'
            FROM cart c
            LEFT JOIN cartitem ci ON c.cartId = ci.cartId
            LEFT JOIN productvariant v ON ci.productVariantId = v.productVariantId
            LEFT JOIN product p ON v.productId = p.productId
            WHERE c.userId = ?
        `;

        const [ cart ] = await dbPool.query(query, [userId]);

        console.log(query);

        return cart;
    } catch (error) {
        console.error("Error finding cart:", error);
        throw error;
    }
};

const findCartItemById = async (cartItemId) => {
    try {
        const query = `
            SELECT * FROM cartitem WHERE cartItemId = ?;
        `;

        const [ cartItem ] = await dbPool.query(query, [cartItemId]);
        console.log(query);
        return cartItem;
    } catch (error) {
        console.error("Error finding cart item by ID:", error);
        throw error;
    }
}

const createOneCart = async (userId, productVariantId, quantity, connection) => {
    try {
        let cart = await findCartByUserId(userId);
        if (cart.length === 0) {
            const query = `INSERT INTO cart (userId) VALUES (?)`;
            const [result] = await connection.query(query, [userId]);

            cart = [{ cartId: result.insertId }];
        }

        const cartId = cart[0].cartId;

        const query2 = `
            INSERT INTO cartitem (cartId, productVariantId, quantity)
            VALUES (?, ?, ?)
        `;

        const [ newCart ] = await connection.query(query2, [cartId, productVariantId, quantity]);

        return { cartItemId: newCart.insertId, cartItem: newCart[0] };
    } catch (error) {
        console.error("Error creating cart:", error);
        throw error;
    }
}

const updateOneCartItem = async (cartItemId, quantity, connection) => {
    try {
        const query = `
            UPDATE cartitem
            SET quantity = ?
            WHERE cartItemId = ?
        `;
        const [ result ] = await connection.query(query, [quantity, cartItemId]);
        console.log(query);

        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error updating cart item:", error);
        throw error;
    }
};

const deleteOneCartItem = async (cartId, cartItemId, connection) => {
    try {
        const query = `
            DELETE FROM cartitem
            WHERE cartItemId = ?;
        `;

        const [ result ] = await connection.query(query, [cartItemId]);
        console.log(query);

        const query2 = `
            SELECT * FROM cartitem WHERE cartId = ?;
        `;

        const [ cartItems ] = await connection.query(query2, [cartId]);
        if (cartItems.length === 0) {
            const query3 = `
                DELETE FROM cart WHERE cartId = ?;
            `;

            await connection.query(query3, [cartId]);
        }

        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error deleting cart item:", error);
        throw error;
    }
}

const deleteOneCart = async (userId, connection) => {
    try {
        const query = `
            DELETE FROM cart WHERE userId = ?;
        `;

        const [ result ] = await connection.query(query, [userId]);
        console.log(query);

        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error deleting cart:", error);
        throw error;
    }
}

module.exports = {
    findCart,
    createOneCart,
    updateOneCartItem,
    deleteOneCartItem,
    findCartByVariantId,
    deleteOneCart,
    findCartItemById
}