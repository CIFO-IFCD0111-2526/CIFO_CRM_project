
const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");
const usuarioController = require("../controllers/usuarioController");

const router = Router();

const { Usuario } = require("../models");
const { loadResource } = require("../middlewares/loadResource.js");

router.use(authPage);

router.get("/", usuarioController.getPerfil);
module.exports = router;