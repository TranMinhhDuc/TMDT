const dbPool = require('../config/dbConnection');
const { findOrderById, findOrdersByUserId, createAnOrder, deleteAnOrder, findOrders, updateOrderStatus } = require('../models/order.model');
const { findCart, deleteOneCart } = require('../models/cart.model');
const { findUserById } = require('../models/user.model');
const { createOnePayment, updateOnePayment } = require('../models/payment.model');

const createOrder = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();
    try {
        const userId = req.user.userId;
        const { address, totalPrice, cart, paymentMethod } = req.body;

        if (!address || !totalPrice || !cart || !paymentMethod) {
            throw Object.assign(new Error('Missing required fields'), { statusCode: 400 });
        }

        const orderDetails = cart.map(item => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity
        }));

        const newOrderId = await createAnOrder(userId, totalPrice, address, orderDetails, connection);
        if (!newOrderId) {
            throw Object.assign(new Error('Failed to create order'), { statusCode: 500 });
        }

        const requestId = paymentMethod + new Date().getTime();

        if (paymentMethod === 'momo') {
            const accessKey = "F8BBA842ECF85";
            const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            const orderId = requestId;
            const orderInfo = "pay with MoMo";
            const redirectUrl = "http://localhost:5001/api/v1/payment/momo";
            const ipnUrl = "http://localhost:5001/api/v1/payment/momo";
            const amount = totalPrice.toString();
            const requestType = "captureWallet";
            const extraData = "";

            const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=MOMO&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
            const signature = require('crypto').createHmac('sha256', secretkey).update(rawSignature).digest('hex');

            const requestBody = {
                partnerCode: "MOMO",
                accessKey,
                requestId,
                amount,
                orderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                extraData,
                requestType,
                signature,
                lang: 'en'
            };

            await createOnePayment(newOrderId, paymentMethod, requestId, totalPrice, connection);

            const axios = require('axios');
            const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
                headers: { 'Content-Type': 'application/json' }
            });

            const deleteCartResult = await deleteOneCart(req.user.userId, connection);
            if (!deleteCartResult) {
                const error = new Error('Failed to delete cart');
                error.statusCode = 500;
                throw error;
            }
            await connection.commit();
            connection.release();
            return res.status(200).json({ payUrl: response.data.payUrl });

        } else if (paymentMethod === 'cash') {
            const paymentResult = await createOnePayment(newOrderId, paymentMethod, requestId, totalPrice, connection);
            if (!paymentResult) {
                throw Object.assign(new Error('Failed to create payment'), { statusCode: 500 });
            }

            const cartId = cart[0].cartId;
            const deleteCartResult = await deleteOneCart(cartId, connection);
            if (!deleteCartResult) {
                const error = new Error('Failed to delete cart');
                error.statusCode = 500;
                throw error;
            }
            await connection.commit();
            connection.release();
        } else {
            throw Object.assign(new Error('Invalid payment method'), { statusCode: 400 });
        }

    } catch (error) {
        await connection.rollback();
        connection.release();
        next(error);
    }
};


const getOrderByUserId = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            const error = new Error('User ID is required');
            error.statusCode = 400;
            throw error;
        }

        const user = await findUserById(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        const orders = await findOrdersByUserId(userId);
        if (!orders || orders.length === 0) {
            const error = new Error('No orders found for this user');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            user,
            data: orders
        });
    } catch (error) {
        next(error);
    }
}

const getOrders = async (req, res, next) => {
    try {
        console.log(req.user);
        if(req.user.role !== 'admin') {
            const error = new Error('Unauthorized access');
            error.statusCode = 403;
            throw error;
        }

        const { page = 1, limit = 10 } = req.query;

        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);
        const offset = (parsedPage - 1) * parsedLimit;

        const {orders, totalItems} = await findOrders(offset, parsedLimit);
        if (!orders || orders.length === 0) {
            const error = new Error('No orders found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            data: orders,
            currentPage: parsedPage,
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / parsedLimit)
        });
    } catch (error) {
        next(error);
    }
}

const deleteOrder = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();
    try {
        if(req.user.role !== 'admin') {
            const error = new Error('Unauthorized access');
            error.statusCode = 403;
            throw error;
        }

        const orderId = req.params.orderId;
        if (!orderId) {
            const error = new Error('Order ID is required');
            error.statusCode = 400;
            throw error;
        }
        const order = await findOrderById(orderId);
        if (!order || order.length === 0) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }

        const deleteResult = await deleteAnOrder(orderId, connection);
        if (!deleteResult) {
            const error = new Error('Failed to delete order');
            error.statusCode = 500;
            throw error;
        }

        await connection.commit();
        connection.release();
        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        await connection.rollback();
        connection.release();
        next(error);
    }
}

const updateOrder = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();
    try {
        if(req.user.role !== 'admin') {
            const error = new Error('Unauthorized access');
            error.statusCode = 403;
            throw error;
        }

        const { orderId, status } = req.body;

        if (!orderId || !status) {
            const error = new Error('Order ID and status are required');
            error.statusCode = 400;
            throw error;
        }

        const order = await findOrderById(orderId);
        if (!order || order.length === 0) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }

        const updatedOrder = await updateOrderStatus(orderId, status, connection);
        if (!updatedOrder) {
            const error = new Error('Failed to update order');
            error.statusCode = 500;
            throw error;
        }

        await connection.commit();
        connection.release();
        res.status(200).json({
            success: true,
            message: 'Order updated successfully',
        });
    } catch (error) {
        await connection.rollback();
        connection.release();
        next(error);
    }
}

module.exports = {
    createOrder,
    getOrderByUserId,
    getOrders,
    deleteOrder,
    updateOrder
};