const express = require('express');
const productController = require("../controllers/product.controller");
const router = express.Router();

router.get('/', productController.getProducts);

router.get('/featured/:count', productController.getFeaturedProducts);

router.post('/', productController.addProduct);

router.delete('/:id', productController.deleteProduct);

router.get('/count', productController.getProductCount);

router.get('/:id', productController.getProduct);

router.put('/:id', productController.updateProduct);


module.exports = router;