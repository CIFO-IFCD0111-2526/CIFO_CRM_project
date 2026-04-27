const { Router } = require("express");
const controller = require("../controllers/cursoController");
const { authPage } = require("../middlewares/auth.js");

const router = Router();


// Rutas de cursos, todas requieren autenticacion
router.use(authPage);
// Formulario de creación de cursos
router.get('/nuevo', authPage, controller.renderNuevoCurso);

// Crear curso (POST vía fetch)
router.post('/', authPage, controller.crearCurso);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);





module.exports = router;
