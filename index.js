const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

require('dotenv/config');

const app = express();

const PREFIX = process.env.API_PREFIX || '/api';
const PORT = process.env.SERVER_PORT || 3000;

// middlewares
app.use(express.json());
app.use(morgan('tiny'));

app.get(`${PREFIX}/v1`, (req, res) => {
    res.send({message: 'Hello World!'});
});

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