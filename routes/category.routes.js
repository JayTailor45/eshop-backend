const express = require('express');
const categoryController = require("../controllers/category.controller");
const router = express.Router();

router.get('/', categoryController.getCategories);

router.post('/', categoryController.addCategory);

router.delete('/:id', categoryController.deleteCategory);

router.get('/:id', categoryController.getCategory);

router.put('/:id', categoryController.updateCategory);

module.exports = router;