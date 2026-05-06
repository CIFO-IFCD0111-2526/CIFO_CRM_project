const { Router } = require("express");
const controller = require("../controllers/cursoController");
const { authPage } = require("../middlewares/auth.js");
const { loadResource } = require("../middlewares/loadResource.js");
const { Curso, Uf, Profesor, Alumno } = require("../models");

const router = Router();


// Rutas de cursos, todas requieren autenticacion
// router.use(authPage);

router.get('/nuevo', controller.renderNewCurso);
router.post('/', controller.createCurso);
router.get("/", controller.getAll);
router.get("/buscar", controller.searchCurso);
router.get("/:id",
    loadResource(Curso, { redirectTo: "/cursos", include: [Uf, Profesor, Alumno] }),
    controller.getById
);
router.delete("/:id",
    loadResource(Curso, { redirectTo: "/cursos" }),
    controller.deleteCurso
);
router.put("/:id",
    loadResource(Curso, { redirectTo: "/cursos" }),
    controller.updateCurso
);
router.post("/:id/alumnos",
    loadResource(Curso, { redirectTo: "/cursos" }),
    controller.addAlumnoToCurso
);
router.delete("/:cursoId/alumnos/:alumnoId", controller.deleteAlumnoFromCurso);
router.post('/:id/profesores', controller.asignarProfesor);

module.exports = router;
