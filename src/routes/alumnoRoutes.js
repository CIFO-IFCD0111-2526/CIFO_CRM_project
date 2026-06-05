const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");

const controller = require("../controllers/alumnoController");

const router = Router();

const { Alumno, Curso, Comentario, Usuario } = require("../models");
const { loadResource } = require("../middlewares/loadResource.js");

// Todas las rutas de alumnos requieren autenticación
router.use(authPage);

// Ruta para buscar alumnos por nombre o apellido
router.get("/buscar", controller.searchAlumno);

router.get("/", controller.getAll);
router.get("/nuevo", controller.renderNewAlumno);
router.post("/", controller.createAlumno);
router.get("/export.csv", controller.exportCsv);

router.post(
    "/import.csv",
    controller.upload.single("archivo"),
    controller.importCsv
);

router.get("/:id",
    loadResource(Alumno, {
        redirectTo: "/alumnos",
        include: [
            {
                model: Curso,
                through: { attributes: ["estat", "createdAt"] }
            },
            {
                model: Comentario,
                include: [Usuario]
            }]
    }),
    controller.getById
);

router.put("/:id",
    loadResource(Alumno, { notFoundMessage: "L'alumne no existeix." }),
    controller.updateAlumno
);
router.delete("/:id",
    loadResource(Alumno),
    controller.deleteAlumno
);

module.exports = router;