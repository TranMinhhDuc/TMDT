const express = require('express');
const { momoResult, updatePayment } = require('../controllers/payment.controller');

const paymentRouter = express.Router();

paymentRouter.get('/momo', momoResult);
paymentRouter.put('/', updatePayment);

module.exports = paymentRouter;
