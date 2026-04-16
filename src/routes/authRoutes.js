// -------------------------------------------------------
// Rutas: Login / Logout
// -------------------------------------------------------

const { Router } = require("express");
const controller = require("../controllers/authController");

const router = Router();

router.get("/login", controller.showLogin);   // mostrar formulario
router.post("/login", controller.login);       // procesar login
router.post("/logout", controller.logout);     // cerrar sesión

module.exports = router;
