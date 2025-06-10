const { getCart,
    createCartItem,
    updateCartItem,
    deleteCartItem } = require('../controllers/cart.controller');
const authorize = require('../middlewares/auth.middleware');
const Router = require('express');

const cartRouter = Router();

cartRouter.get('/', authorize, getCart);
cartRouter.post('/', authorize, createCartItem);
cartRouter.put('/:id', authorize, updateCartItem);
cartRouter.delete('/:id', authorize, deleteCartItem);

module.exports = cartRouter; 