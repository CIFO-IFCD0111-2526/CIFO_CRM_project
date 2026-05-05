const { Router } = require("express");
const controller = require("../controllers/cursoController");
const { authPage } = require("../middlewares/auth.js");
const { loadResource } = require("../middlewares/loadResource.js");
const { Curso, Uf, Profesor, Alumno } = require("../models");

const router = Router();


// Rutas de cursos, todas requieren autenticacion
router.use(authPage);

router.get('/nuevo', controller.renderNuevoCurso);
router.post('/', controller.crearCurso);
router.get("/", controller.getAll);
router.get("/:id",
    loadResource(Curso, { redirectTo: "/cursos", include: [Uf, Profesor, Alumno] }),
    controller.getById
);
router.delete("/:id",
    loadResource(Curso, { redirectTo: "/cursos" }),
    controller.eliminarCurso
);

module.exports = router;
