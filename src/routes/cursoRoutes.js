const { Router } = require("express");
const controller = require("../controllers/cursoController");
const { authPage } = require("../middlewares/auth.js");

const router = Router();


// Rutas de cursos, todas requieren autenticacion
router.use(authPage);

router.get('/nuevo', controller.renderNuevoCurso);
router.post('/', controller.crearCurso);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.delete("/:id", controller.eliminarCurso);
////////////////////////////////////////////////////// AFEGIM ENDPOINT PER EDITAR ( put/update )
router.put("/:id/editar", controller.editarCurso);

module.exports = router;
