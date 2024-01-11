const express = require("express");
const router = express.Router();

const usuarioAppController = require("../controller/usuarioAppController.js");
const apiController = require("../controller/apiController.js");
const infoController = require("../controller/infoController.js");

router.post("/registerApp", usuarioAppController.createUser);
router.post("/loginApp", usuarioAppController.loginAppUser);
router.post("/authToken", usuarioAppController.authToken);
router.post("/reenviarToken", usuarioAppController.reenviarCorreo);

router.get("/login", apiController.login);
router.get("/callback", apiController.callback);
router.get("/refreshToken", apiController.refreshToken);
router.post("/logout", apiController.logout);

router.get("/datsU/:userId", infoController.datsU);
router.get("/datsT/:trackId", infoController.datsT);
router.get("/datsA/:artistId", infoController.datsA);
router.get("/users/:email/:userId", infoController.users);

module.exports = router;
