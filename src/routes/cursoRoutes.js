const { Router } = require("express");
const controller = require("../controllers/cursoController");
const { authPage } = require("../middlewares/auth.js");

const router = Router();

router.use("/", authPage);

// Rutas de cursos deben requerir autenticacion

router.get("/", authPage, controller.getAll);
router.get("/:id", authPage, controller.getById);

module.exports = router;
