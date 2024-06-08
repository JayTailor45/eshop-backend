const express = require('express');
const userController = require("../controllers/user.controller");
const router = express.Router();

router.get('/', userController.getUsers);

router.post('/', userController.addUser);

router.delete('/:id', userController.deleteUser);

router.get('/:id', userController.getUser);

router.put('/:id', userController.updateUser);

module.exports = router;