const dbPool = require('../config/dbConnection');
const { findOrderById, findOrdersByUserId, createAnOrder, deleteAnOrder, findOrders, updateOrderStatus, findOrderProfile } = require('../models/order.model');
const { findCart, deleteOneCart } = require('../models/cart.model');
const { findUserById } = require('../models/user.model');
const { createOnePayment, updateOnePayment } = require('../models/payment.model');
const { soldProduct } = require('../models/variant.model');
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat} = require('vnpay');

const createOrder = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();
    try {
        const userId = req.user.userId;
        console.log(req.body)
        const {customerName, address, totalPrice, cart, paymentMethod } = req.body;

        if (!address || !totalPrice || !cart || !paymentMethod) {
            throw Object.assign(new Error('Missing required fields'), { statusCode: 400 });
        }

        const orderDetails = cart.map(item => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity
        }));

        const newOrderId = await createAnOrder(userId, totalPrice, address, orderDetails, customerName, connection);
        if (!newOrderId) {
            throw Object.assign(new Error('Failed to create order'), { statusCode: 500 });
        }

        
        const requestId = userId + new Date().getTime();

        if (paymentMethod === 'vnpay') {
            const vnpay = new VNPay({
                tmnCode:'VBL5LT3T',
                secureSecret:'CXF61PS6NHFY7RMR33URT4I0RT52GUAP',
                vnpayHost: 'https://sandbox.vnpayment.vn',
                testMode: true,
                hashAlgorithm:'SHA512',
                loggerFn:ignoreLogger,
            })

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1)

            const vnpayResponse = await vnpay.buildPaymentUrl({
                vnp_Amount: totalPrice,
                vnp_IpAddr: '127.0.0.1',
                vnp_TxnRef: requestId,
                vnp_OrderInfo: requestId,
                vnp_OrderType: ProductCode.Other,
                vnp_ReturnUrl: 'http://localhost:5173/payment-result',
                vnp_Locale: VnpLocale.VN,
                vnp_CreateDate: dateFormat(new Date()),
                vnp_ExpireDate: dateFormat(tomorrow)
            })


            await createOnePayment(newOrderId, paymentMethod, requestId, totalPrice, connection);

            const deleteCartResult = await deleteOneCart(req.user.userId, connection);
            if (!deleteCartResult) {
                const error = new Error('Failed to delete cart');
                error.statusCode = 500;
                throw error;
            }
            await connection.commit();
            connection.release();
            return res.status(200).json({ payUrl: vnpayResponse });

        } else if (paymentMethod === 'cash') {
            const paymentResult = await createOnePayment(newOrderId, paymentMethod, requestId, totalPrice, connection);
            if (!paymentResult) {
                throw Object.assign(new Error('Failed to create payment'), { statusCode: 500 });
            }
            for(let i = 0; i < orderDetails.length; i++) {
                console.log('element: ', orderDetails[i]);
                const soldResult = await soldProduct(orderDetails[i].productVariantId, orderDetails[i].quantity, connection);
                if(!soldResult) {
                    const error = new Error('Failed to sold product');
                    error.statusCode = 500;
                    throw error;
                }
            }

            const deleteCartResult = await deleteOneCart(req.user.userId, connection);
            if (!deleteCartResult) {
                const error = new Error('Failed to delete cart');
                error.statusCode = 500;
                throw error;
            }
            await connection.commit();
            connection.release();

            res.status(200).json({
                success: true,
                message: 'success'
            })
        } else {
            throw Object.assign(new Error('Invalid payment method'), { statusCode: 400 });
        }

    } catch (error) {
        await connection.rollback();
        connection.release();
        next(error);
    } finally {
        if (connection) connection.release();
    }
};


const getOrderByUserId = async (req, res, next) => {
    try {
        if(req.user.role != 'admin') {
            const error = new Error('This user can\'t access this resource')
            error.statusCode = 403;
            throw error;
        }

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

const getOrderProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const {page, limit} = req.query;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const orders = await findOrderProfile(userId, parsedPage, parsedLimit);
        
        if (!orders) {
            const error = new Error('False to get orders profile')
            error.statusCode = 404;
            throw error
        }

        res.status(200).json({
            success: true,
            message: 'Get orders profile successfully',
            data: {
                orders
            }
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createOrder,
    getOrderByUserId,
    getOrders,
    deleteOrder,
    updateOrder,
    getOrderProfile
};