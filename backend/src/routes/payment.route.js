const express = require('express');
const { vnpayResult, updatePayment } = require('../controllers/payment.controller');

const paymentRouter = express.Router();

paymentRouter.post('/vnpay', vnpayResult);
paymentRouter.put('/', updatePayment);

module.exports = paymentRouter;
