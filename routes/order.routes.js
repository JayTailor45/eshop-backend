const express = require('express');
const orderController = require("../controllers/order.controller");
const router = express.Router();

router.get('/', orderController.getOrders);

router.post('/', orderController.addOrder);

router.get('/total-sales', orderController.getTotalSales);

router.get('/count', orderController.getOrderCount);

router.get('/user/:id', orderController.getUserOrders);

router.delete('/:id', orderController.deleteOrder);

router.get('/:id', orderController.getOrder);

router.put('/:id', orderController.updateOrderStatus);

module.exports = router;