const express = require("express");
const router = express.Router();

const usuarioAppController = require("../controller/usuarioAppController.js");
const usuarioController = require("../controller/usuarioController.js");
const infoController = require("../controller/infoController.js");

router.get("/", usuarioController.i);
router.get("/login", usuarioController.login);
router.get("/callback", usuarioController.callback);
router.get("/refreshToken", usuarioController.refreshToken);
router.get("/register", usuarioController.register);
router.get("/redirectRegister", usuarioController.redirectRegister);
router.get("/logout", usuarioController.logout);

router.post("/register/:userId", usuarioAppController.createUser);
router.post("/loginApp", usuarioAppController.loginAppUser);
router.get("/token", usuarioAppController.token);
router.get("/redirectToken", usuarioAppController.redirectToken);
router.get("/inicioApp", usuarioAppController.inicioApp);
router.get("/inicio", usuarioAppController.inicio);
router.get("/redirectInicio", usuarioAppController.redirectInicio);


router.get("/datsU/:userId", infoController.datsU);
//router.get("/datsUApp/:userId", infoController.datsUApp);
router.get("/datsT/:trackId", infoController.datsT);
router.get("/datsA/:artistId", infoController.datsA);

module.exports = router;
