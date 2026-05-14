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

// Ruta para buscar profesores por nombre o apellido
router.get("/buscar", profesorController.searchProfesor);

router.get("/nuevo", profesorController.renderNewProfesor);
router.get("/", profesorController.getAll);
router.post("/", profesorController.createProfesor);

router.get("/buscar-disponibles", profesorController.getAvailable);


// las que dependen de /:id hacen que TODO pase por esos endpoints y ya no llega a 
// esos endpoints y ya no llega a los siguientes. ( intenta leer cualquir cosa como id i no los "encuentra")
// xk ya has entrado a ésta categoria 
router.get("/:id",
    loadResource(Profesor, {
        redirectTo: "/profesores",
        include: [{ model: Curso, attributes: ["id", "codigo_curso", "codigo_accion_formativa", "nombre"] }]
    }),
    profesorController.getById
);
router.get("/:id/editar",
    loadResource(Profesor, { redirectTo: "/profesores" }),
    profesorController.getEditForm
);
router.put("/:id",
    loadResource(Profesor, { redirectTo: "/profesores" }),
    profesorController.updateProfesor
);
router.delete("/:id",
    loadResource(Profesor),
    profesorController.deleteProfesor
);

module.exports = router;