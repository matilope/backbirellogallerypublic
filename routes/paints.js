const express = require("express");
const PaintsController = require("../controllers/paints");
const router = express.Router();
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const verifyToken = require('../helpers/jwt');


// Rutas para pinturas
router.post("/save", verifyToken, multipartMiddleware, PaintsController.save);
router.get("/paintings/:page?", PaintsController.getPinturas);
router.get("/painting/:id", PaintsController.getPintura);
router.put("/painting/:id", verifyToken, multipartMiddleware, PaintsController.update);
router.delete("/painting/:id", verifyToken, PaintsController.delete);
router.post("/delete_image", verifyToken, multipartMiddleware, PaintsController.deleteImage);
router.get("/search/:search?", PaintsController.search);

module.exports = router;