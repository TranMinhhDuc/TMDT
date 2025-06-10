const express = require('express');
const { PORT } = require('./config/env');
const cors = require('cors');
const dbConnection = require('./config/dbConnection');

const errorMiddleware = require('./middlewares/error.middleware');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const categoryRouter = require('./routes/category.route');
const productRouter = require('./routes/product.route');
const wishListRouter = require('./routes/wishList.route');
const reviewRouter = require('./routes/review.route');
const cartRouter = require('./routes/cart.route');
const orderRouter = require('./routes/order.route');
const paymentRouter = require('./routes/payment.route');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/wishlist', wishListRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/payment', paymentRouter);


app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
