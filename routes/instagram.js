var express = require("express");
var InstagramController = require("../controllers/instagram");
var router = express.Router();
var verifyToken = require('../helpers/jwt');

// Rutas para usuarios
router.post("/savetoken", verifyToken, InstagramController.saveToken);
router.get("/tokens/:last?",  InstagramController.getTokens);
router.get("/token/:id",  InstagramController.getToken);
router.put("/token/:id", verifyToken, InstagramController.updateToken);

module.exports = router;