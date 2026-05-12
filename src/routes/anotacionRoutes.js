const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");
const controller = require("../controllers/anotacionController");

const router = Router();

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
