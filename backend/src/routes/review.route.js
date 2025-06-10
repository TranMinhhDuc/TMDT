const Router = require('express');
const { getReview, 
    createReview, 
    deleteReview } = require('../controllers/review.controller');
const authorize = require('../middlewares/auth.middleware')

const reviewRouter = Router();
reviewRouter.get('/:id', getReview);     
reviewRouter.post('/',authorize, createReview);
reviewRouter.delete('/:id',authorize, deleteReview);

module.exports = reviewRouter;