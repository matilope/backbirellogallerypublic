var express = require("express");
var PortraitController = require("../controllers/portraitcontroller");
var router = express.Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
var verifyToken = require('../helpers/jwt');

router.get("/portraits/:last?", PortraitController.getPortraits);
router.get("/portrait/:id", PortraitController.getPortrait);
router.put("/portrait/:id", verifyToken, PortraitController.updatePortrait);
router.post("/portrait/upload", verifyToken, multipartMiddleware, PortraitController.uploadPortrait);


module.exports = router;