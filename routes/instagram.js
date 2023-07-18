const express = require("express");
const InstagramController = require("../controllers/instagram");
const router = express.Router();
const verifyToken = require('../helpers/jwt');

// Rutas para usuarios
router.post("/savetoken", verifyToken, InstagramController.save);
router.get("/tokens/:last?", InstagramController.getTokens);
router.get("/token/:id", InstagramController.getToken);
router.put("/token/:id", verifyToken, InstagramController.update);

module.exports = router;