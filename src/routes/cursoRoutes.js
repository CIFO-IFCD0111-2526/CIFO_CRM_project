const { Router } = require("express");
const controller = require("../controllers/cursoController");
const { authPage, requireEditor } = require("../middlewares/auth.js");
const { loadResource } = require("../middlewares/loadResource.js");
const { Curso, Profesor, Alumno } = require("../models");

const router = Router();


// Rutas de cursos, todas requieren autenticacion
router.use(authPage);

router.get('/nuevo', requireEditor, controller.renderNewCurso);
router.post('/', requireEditor, controller.createCurso);
router.get("/", controller.getAll);
router.get("/buscar", controller.searchCurso);
router.get("/:id",
    loadResource(Curso, { redirectTo: "/cursos", include: [Profesor, Alumno] }),
    controller.getById
);
router.delete("/:id",
    requireEditor,
    loadResource(Curso, { redirectTo: "/cursos" }),
    controller.deleteCurso
);
router.put("/:id",
    requireEditor,
    loadResource(Curso, { redirectTo: "/cursos" }),
    controller.updateCurso
);
router.post("/:id/alumnos",
    requireEditor,
    loadResource(Curso, { redirectTo: "/cursos" }),
    controller.addAlumnoToCurso
);
router.delete("/:cursoId/alumnos/:alumnoId", requireEditor, controller.deleteAlumnoFromCurso);
router.put("/:cursoId/alumnos/:alumnoId", requireEditor, controller.updateAlumnoMatricula);
router.post('/:id/profesores', requireEditor, controller.asignarProfesor);
router.delete('/:id/profesores/:profesorId', requireEditor, controller.desasignarProfesor);

module.exports = router;
