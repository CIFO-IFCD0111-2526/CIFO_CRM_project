const { Router } = require("express");
const { authPage, requireEditor, requireAdmin } = require("../middlewares/auth.js");

const controller = require("../controllers/alumnoController");

const router = Router();

const { Alumno, Curso, Comentario, Usuario } = require("../models");
const { loadResource } = require("../middlewares/loadResource.js");

// Todas las rutas de alumnos requieren autenticación
router.use(authPage);

// Ruta para buscar alumnos por nombre o apellido
router.get("/buscar", controller.searchAlumno);

router.get("/", controller.getAll);
router.get("/nuevo", requireEditor, controller.renderNewAlumno);
router.post("/", requireEditor, controller.createAlumno);
router.get("/export.csv", requireAdmin, controller.exportCsv);

router.post(
    "/import.csv",
    requireEditor,
    controller.upload.single("archivo"),
    controller.importCsv
);

router.get("/:id",
    loadResource(Alumno, {
        redirectTo: "/alumnos",
        include: [
            {
                model: Curso,
                through: { attributes: ["estat", "createdAt", "apte", "fecha_baixa"] }
            },
            {
                model: Comentario,
                include: [Usuario]
            }]
    }),
    controller.getById
);

router.put("/:id",
    requireEditor,
    loadResource(Alumno, { notFoundMessage: "L'alumne no existeix." }),
    controller.updateAlumno
);
router.delete("/:id",
    requireEditor,
    loadResource(Alumno),
    controller.deleteAlumno
);

module.exports = router;