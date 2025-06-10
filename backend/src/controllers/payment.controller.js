const dbPool = require('../config/dbConnection');
const { updateOnePayment, updatePaymentById } = require('../models/payment.model');

const momoResult = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        const { requestId, resultCode } = req.query;
        console.log('Received requestId:', requestId);
        console.log('Received resultCode:', resultCode);
        
        if (!requestId || !resultCode) {
            const error = new Error('Missing requestId or resultCode');
            error.statusCode = 400;
            throw error;
        }

        if (resultCode !== '99') {
            const error = new Error('Payment failed');
            error.statusCode = 400;
            throw error;
        }

        const result = await updateOnePayment('paid', requestId, connection);

        if (!result) {
            const error = new Error('payment result failed');
            error.statusCode = 500;
            throw error;
        }
        await connection.commit();
        connection.release();

        return res.status(200).json({
            success: true,
            message: 'Momo payment result received successfully',
        });
    } catch (error) {
        await connection.rollback();
        connection.release();
        next(error);
        
    }
}

const updatePayment = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        const { paymentStatus, paymentId } = req.body;
        if (!paymentStatus || !paymentId) {
            const error = new Error('Payment status and order ID are required');
            error.statusCode = 400;
            throw error;
        }

        const result = await updatePaymentById(paymentStatus, paymentId, connection);
        if (!result) {
            const error = new Error('Failed to update payment');
            error.statusCode = 500;
            throw error;
        }

        await connection.commit();
        connection.release();
        res.status(200).json({
            success: true,
            message: 'Payment updated successfully',
        });

    } catch (error) {
        connection.rollback();
        connection.release();
        next(error);
    }
}

module.exports = {
    momoResult,
    updatePayment
};