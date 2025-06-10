const Router = require('express');
const { getProfile, getUser, getUsers } = require('../controllers/user.controller');
const authorize = require('../middlewares/auth.middleware');

const userRouter = Router();

userRouter.get('/profile', authorize, getProfile);
userRouter.get('/:id', authorize, getUser);
userRouter.get('/', authorize, getUsers);

module.exports = userRouter;