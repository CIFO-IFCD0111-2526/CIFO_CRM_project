const { Router } = require("express");
const { authPage } = require("../middlewares/auth");

const controller = require("../controllers/comentarioController");

const router = Router();

// Todas las rutas requieren autenticación
router.use(authPage);

module.exports = router;