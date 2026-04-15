const { Router } = require("express");
const controller = require("../controllers/authController");

const router = Router();

// Rutas de autenticación

router.post("/login", controller.login);
router.post("/login", controller.logout);