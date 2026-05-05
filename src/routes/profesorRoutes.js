// Rutes relacionades amb els professors. 
// Permet mostrar la llista de professors amb les seves dades i els cursos que imparteixen.
// Ruta protegida con authPage.

const express = require("express");
const router = express.Router();

const profesorController = require("../controllers/profesorController");
const { authPage } = require("../middlewares/auth");

router.get("/nuevo", authPage, profesorController.renderNewProfesor);
router.get("/", authPage, profesorController.getAll);
router.post("/", authPage, profesorController.createProfesor);
router.get("/:id", authPage, profesorController.getById);
router.get("/:id/editar", authPage, profesorController.getEditForm);
router.put("/:id", authPage, profesorController.updateProfesor);
router.delete("/:id", authPage, profesorController.deleteProfesor);

module.exports = router;