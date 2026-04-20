const express = require("express");
const router = express.Router();

const profesorController = require("../controllers/profesorController");
const { authPage } = require("../middlewares/authPage");

router.get("/", authPage, profesorController.listarProfesores);

module.exports = router;

