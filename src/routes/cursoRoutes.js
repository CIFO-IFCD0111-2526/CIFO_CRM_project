const { Router } = require("express");
const controller = require("../controllers/cursoController");
const { authPage } = require("../middlewares/auth.js");

const router = Router();

// Rutas de cursos, todas requieren autenticacion
router.use(authPage);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);

module.exports = router;
