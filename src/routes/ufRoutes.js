const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");
const controller = require("../controllers/ufController");

const router = Router();

// Todas las rutas de UFs requieren autenticación
router.use(authPage);

router.get("/", controller.getAll);

module.exports = router;
