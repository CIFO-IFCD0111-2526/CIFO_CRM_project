const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");

const controller = require("../controllers/alumnoController");

const router = Router();

// Todas las rutas de alumnos requieren autenticación
router.use(authPage);

// Ruta para buscar alumnos por nombre o apellido
router.get("/buscar", controller.searchAlumno);


router.get("/", controller.getAll);
router.get("/nuevo", controller.renderNewAlumno);
router.post("/", controller.createAlumno);
router.get("/:id", controller.getById);
router.delete("/:id",controller.deleteAlumno);
router.put("/:id", controller.updateAlumno);
module.exports = router;