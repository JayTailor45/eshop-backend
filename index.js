const express = require('express');
const morgan = require('morgan');

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

app.listen(PORT, () => {
    console.log(`Server is up and listening on port ${PORT}!`);
});