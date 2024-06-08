const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

const productRouter = require('./routes/product.routes');
const categoryRouter = require('./routes/category.routes');
const userRouter = require('./routes/user.routes');
const orderRouter = require('./routes/order.routes');

require('dotenv/config');
const path = require("node:path");

const app = express();

const PREFIX = process.env.API_PREFIX || '/api';
const PORT = process.env.SERVER_PORT || 3000;

// middlewares
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));


// hello route
app.get(`${PREFIX}`, (req, res) => {
    res.send({message: 'Hello World!'});
});

// routes
app.use(`${PREFIX}/v1/products`, productRouter);
app.use(`${PREFIX}/v1/categories`, categoryRouter);
app.use(`${PREFIX}/v1/users`, userRouter);
app.use(`${PREFIX}/v1/orders`, orderRouter);

mongoose.connect(`${process.env.MONGODB_URL}?directConnection=true&authSource=admin&retryWrites=true`, {
    dbName: process.env.MONGODB_DB_NAME,
})
    .then(() => {
        console.log('Connected to MongoDB...');
    })
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server is up and listening on port ${PORT}!`);
});