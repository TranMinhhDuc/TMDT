const dbPool = require('../config/dbConnection');

const createAnOrder = async (userId, totalAmount, address, orderDetails, customerName, connection) => {
    try {
        const query = `
            INSERT INTO orders (userId, totalPrice, status, address, userPayment)
            VALUES (?, ?, ?, ?, ?);
        `;

        const [result] = await connection.query(query, [userId, totalAmount, 'pending', address, customerName]);
        const orderId = result.insertId;
        console.log(query);

        if(result.affectedRows === 0) {
            const error = new Error('Failed to create order');
            error.statusCode = 500;
            throw error;
        }

        const query2 = `
            INSERT INTO orderitems (orderId, productVariantId, quantity)
            VALUES ${orderDetails.map(detail => `(${orderId}, ${detail.productVariantId}, ${detail.quantity})`).join(', ')};
        `;

        console.log(query2);

        const [result2] = await connection.query(query2);

        if(result2.affectedRows === 0) {
            const error = new Error('Failed to create order items');
            error.statusCode = 500;
            throw error;
        }

        return orderId;
    } catch (error) {
        console.error('Error in createAnOrder', error);
        throw error;
    }
}

const findOrderById = async (orderId) => {
    try {
        const query = `
            SELECT o.orderId, o.userId, o.totalPrice, o.status, o.address,
                oi.orderitemId, oi.quantity, oi.price
            FROM orders o
            LEFT JOIN orderitems oi ON o.orderId = oi.orderId
            WHERE o.orderId = ?;
        `;

        const [ order ] = await dbPool.query(query, [orderId]);
        console.log(query);

        return order;
    } catch (error) {
        console.error('Error in findOrderById', error);
        throw error;
    }
}

const findOrdersByUserId = async (userId) => {
    try {
        const query = ` 
            SELECT o.orderId, o.userId, o.totalPrice, o.status, o.address, o.userPayment,
                p.paymentId, p.paymentMethod, p.paymentStatus
            FROM orders o
            LEFT JOIN payment p ON o.orderId = p.orderId
            WHERE o.userId = ? ;
        `;

        const [ orders ] = await dbPool.query(query, [userId]);
        console.log(query);
        return orders;
    } catch (error) {
        console.error('Error in findOrdersByUserId', error);
        throw error;
        
    }
}

const findOrders = async (offset, limit) => {
    try {
        const query = `
            SELECT orderId, userId, totalPrice, status, address
            FROM orders
            LIMIT ${limit} OFFSET ${offset};
        `;

        const queryTotalItems = `
            SELECT COUNT(*) AS totalItems
            FROM orders;
        `;
        const [ totalItemsResult ] = await dbPool.query(queryTotalItems);
        const totalItems = totalItemsResult[0].totalItems;
        const [ orders ] = await dbPool.query(query);
        console.log(query);

        return { orders, totalItems };
    } catch (error) {
        console.error('Error in findOrders', error);
        throw error;
    }
}

const deleteAnOrder = async (orderId, connection) => {
    try {
        const query = `
            DELETE FROM orders
            WHERE orderId = ?;
        `;
        const [ result ] = await connection.query(query, [orderId]);
        console.log(query);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in deleteAnOrder', error);
        throw error;
        
    }
}

const updateOrderStatus = async (orderId, status, connection) => {
    try {
        const query = `
            UPDATE orders
            SET status = ?
            WHERE orderId = ?;
        `;
        const [ result ] = await connection.query(query, [status, orderId]);
        console.log(query);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in updateOrderStatus', error);
        throw error;
    }
}

const findOrderProfile = async (userId, page = 1, limit = 10) => {
    try {
        const query = `
            SELECT o.orderId, o.totalPrice, o.status, o.address, o.userPayment,
                   oi.orderItemId, oi.quantity,
                   pv.color, pv.size,
                   p.name, p.price,
                   i.path
            FROM orders o
                     LEFT JOIN orderitems oi ON o.orderId = oi.orderId
                     LEFT JOIN productvariant pv ON pv.productVariantId = oi.productVariantId
                     LEFT JOIN product p ON p.productId = pv.productId
                     LEFT JOIN images i ON i.imageId = (
                SELECT imageId
                FROM images
                WHERE productId = p.productId
                ORDER BY imageId ASC
                LIMIT 1
                )

            WHERE o.userId = ?
            ORDER BY o.orderId ASC  
            LIMIT ${limit} OFFSET ${page};
        `;

        const [result] = await dbPool.execute(query, [userId]);

        const objectOrders = result.reduce((acc, curr) => {
            const {
                orderId, 
                totalPrice, 
                status,
                address,
                userPayment,
                orderItemId,
                quantity, 
                color,
                size, 
                name,
                price,
                path
            } = curr;

            if(!acc[orderId]) {
                acc[orderId] = {
                    orderId,
                    totalPrice,
                    status,
                    address,
                    userPayment,
                    items: []
                }
            }

            acc[orderId].items.push ({
                orderItemId,
                quantity,
                color,
                size,
                name,
                price,
                path
            });

            return acc;
        }, {});

        const orders = Object.values(objectOrders);
        return orders;
    } catch (error) {
        console.error('Error in getOrderProfile', error);
        throw error;
    }
}
module.exports = {  
    createAnOrder,
    findOrderById,
    findOrdersByUserId,
    deleteAnOrder,
    findOrders,
    updateOrderStatus,
    findOrderProfile
};