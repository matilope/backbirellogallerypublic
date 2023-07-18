const express = require("express");
const PortraitController = require("../controllers/portrait");
const router = express.Router();
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const verifyToken = require('../helpers/jwt');

router.get("/portraits/?", PortraitController.getPortraits);
router.get("/portrait/:id", PortraitController.getPortrait);
router.put("/portrait/:id", verifyToken, multipartMiddleware, PortraitController.updatePortrait);

module.exports = router;