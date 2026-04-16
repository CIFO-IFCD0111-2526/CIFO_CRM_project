// -------------------------------------------------------
// Rutas: /usuarios
// -------------------------------------------------------

const { Router } = require("express");
const controller = require("../controllers/usuarioController");

const router = Router();

router.get("/", controller.getAll);

module.exports = router;
