const dbPool = require('../config/dbConnection');
const { updateOnePayment, updatePaymentById } = require('../models/payment.model');

const vnpayResult = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        const { vnp_orderId, resultCode } = req.body;

        if(resultCode !== '00') {
            const error = new Error('Failed to paid');
            error.statusCode = 500;
            throw error;
        }
        
        const result = await updateOnePayment('paid', vnp_orderId, connection);

        if (!result) {
            const error = new Error('payment result failed');
            error.statusCode = 500;
            throw error;
        }
        await connection.commit();
        connection.release();

        return res.status(200).json({
            success: true,
            message: 'vnpay payment result received successfully',
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
    vnpayResult,
    updatePayment
};