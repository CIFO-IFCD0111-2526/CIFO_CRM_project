// Rutes relacionades amb els professors. 
// Permet mostrar la llista de professors amb les seves dades i els cursos que imparteixen.
// Ruta protegida con authPage.

const express = require("express");
const router = express.Router();

const profesorController = require("../controllers/profesorController");
const { authPage } = require("../middlewares/auth");

router.get("/nuevo", authPage, profesorController.mostrarFormCrear);
router.get("/", authPage, profesorController.listarProfesores);
router.post("/", authPage, profesorController.crearProfesor);
router.get("/:id", authPage, profesorController.getById);
router.get("/:id/editar", authPage, profesorController.mostrarProfesorEditar);
router.put("/:id", authPage, profesorController.editarProfesor);

module.exports = router;

