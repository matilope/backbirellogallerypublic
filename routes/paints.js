var express = require("express");
var PaintsController = require("../controllers/paints");
var router = express.Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
var verifyToken = require('../helpers/jwt');


// Rutas para pinturas
router.post("/save", verifyToken, PaintsController.save);
router.get("/paintings/:page?", PaintsController.getPinturas);
router.get("/painting/:id", PaintsController.getPintura);
router.put("/painting/:id", verifyToken, PaintsController.update);
router.delete("/painting/:id", verifyToken, PaintsController.delete);
router.post("/create", verifyToken, multipartMiddleware, PaintsController.create);
router.post("/deleteimg", verifyToken, multipartMiddleware, PaintsController.deleteImage);


module.exports = router;