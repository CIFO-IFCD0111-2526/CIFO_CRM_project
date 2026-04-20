const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");

const controller = require("../controllers/alumnoController");

const router = Router();

router.use("/", authPage);

// Todas las rutas de alumnos requieren estar autenticadas
router.get("/", authPage, controller.getAll);
router.get("/:id", authPage, controller.getById);

module.exports = router;