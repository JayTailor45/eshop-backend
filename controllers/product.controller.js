const {Product} = require("../models/product.model");

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        if (!products) {
            res.status(500).send('Not Found');
        }
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}