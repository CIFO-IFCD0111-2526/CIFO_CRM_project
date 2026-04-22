const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");

const controller = require("../controllers/alumnoController");

const router = Router();

// Todas las rutas de alumnos requieren autenticación
router.use(authPage);

router.get("/", controller.getAll);
router.get("/nuevo", controller.createFormPrint);
router.get("/:id", controller.getById);

module.exports = router;