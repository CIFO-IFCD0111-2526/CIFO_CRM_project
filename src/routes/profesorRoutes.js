// Rutes relacionades amb els professors. 
// Permet mostrar la llista de professors amb les seves dades i els cursos que imparteixen.
// Ruta protegida con authPage.

const express = require("express");
const router = express.Router();

const profesorController = require("../controllers/profesorController");
const { authPage } = require("../middlewares/auth");
const { loadResource } = require("../middlewares/loadResource.js");
const { Profesor, Curso } = require("../models");

router.use(authPage);

router.get("/nuevo", profesorController.mostrarFormCrear);
router.get("/", profesorController.listarProfesores);
router.post("/", profesorController.crearProfesor);
router.get("/:id",
    loadResource(Profesor, {
        redirectTo: "/profesores",
        include: [{ model: Curso, attributes: ["id", "codigo", "nombre"] }]
    }),
    profesorController.getById
);
router.get("/:id/editar",
    loadResource(Profesor, { redirectTo: "/profesores" }),
    profesorController.mostrarProfesorEditar
);
router.put("/:id",
    loadResource(Profesor, { redirectTo: "/profesores" }),
    profesorController.editarProfesor
);

module.exports = router;

