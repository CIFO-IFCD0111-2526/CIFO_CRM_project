const { Router } = require("express");
const controller = require("../controllers/authController");

const router = Router();

// Rutas de autenticación

router.post("/login", controller.loginForm);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

module.exports = router;