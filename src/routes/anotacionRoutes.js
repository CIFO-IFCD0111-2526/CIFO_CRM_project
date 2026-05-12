/* const { Router } = require("express");
const { authPage } = require("../middlewares/auth");

const controller = require("../controllers/anotacionController");

const router = Router();

// Todas las rutas requieren autenticación
router.use(authPage);

module.exports = router; */
const router = require("express").Router();

const controller = require("../controllers/anotacionController");
const { authPage } = require("../middlewares/auth.js");

// Protección de rutas
router.use(authPage);

// Crear anotación
router.post("/", controller.create);

module.exports = router;