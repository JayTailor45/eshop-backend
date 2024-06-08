const express = require('express');
const userController = require("../controllers/user.controller");
const router = express.Router();

router.get('/', userController.getUsers);

router.get('/count', userController.getUserCount);

router.post('/register', userController.addUser);

router.post('/login', userController.login);

router.delete('/:id', userController.deleteUser);

router.get('/:id', userController.getUser);

router.put('/:id', userController.updateUser);

module.exports = router;