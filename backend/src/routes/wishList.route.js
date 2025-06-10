const Router = require('express');
const { getWishList, 
    createWishList, 
    deleteWishList } = require('../controllers/wishlist.controller');
const authorize = require('../middlewares/auth.middleware');

const wishListRouter = Router();

wishListRouter.get('/', authorize, getWishList);
wishListRouter.post('/', authorize, createWishList);
wishListRouter.delete('/:id', authorize, deleteWishList);

module.exports = wishListRouter;