var express = require("express");
var AdminController = require("../controllers/admincontroller");
var router = express.Router();
var verifyToken = require('../helpers/jwt');

// Rutas para usuarios
router.get("/admin/users/:last?", verifyToken, AdminController.getUsers);
router.delete("/admin/user/:id", verifyToken, AdminController.deleteUser);

module.exports = router;