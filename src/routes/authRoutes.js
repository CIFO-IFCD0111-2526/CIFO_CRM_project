const { Router } = require("express");
const controller = require("../controllers/authController");
const { redirectIfLogged } = require("../middlewares/auth");

const router = Router();

// Rutas de autenticación
router.get("/login", redirectIfLogged, controller.loginForm);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

module.exports = router;


const router = Router();


