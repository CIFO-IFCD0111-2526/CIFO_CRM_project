const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");

const controller = require("../controllers/alumnoController");

const router = Router();

// Todas las rutas de alumnos requieren autenticación
router.use(authPage);

// Ruta para buscar alumnos por nombre o apellido
router.get("/buscar", controller.buscarAlumno);


router.get("/", controller.getAll);
router.get("/nuevo", controller.createFormPrint);
router.post("/", controller.newAlumno);
router.get("/:id", controller.getById);
router.delete("/:id",controller.removeAlumno);
module.exports = router;