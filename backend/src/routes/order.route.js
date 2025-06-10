const Router = require('express');
const { createOrder, getOrderByUserId, getOrders, deleteOrder, updateOrder } = require('../controllers/order.controller');
const authorize = require('../middlewares/auth.middleware');
const orderRouter = Router();

orderRouter.post('/',authorize, createOrder);
orderRouter.get('/user', authorize, getOrderByUserId);
orderRouter.get('/', authorize, getOrders);
orderRouter.delete('/:orderId', authorize, deleteOrder);
orderRouter.put('/', authorize, updateOrder);

module.exports = orderRouter;