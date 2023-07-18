const express = require("express");
const router = express.Router();
const verifyToken = require('../helpers/jwt');
const userController = require('../controllers/user');

// Rutas para usuarios
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get("/users/?", verifyToken, userController.getUsers);
router.delete("/user/:id", verifyToken, userController.deleteUser);

module.exports = router;