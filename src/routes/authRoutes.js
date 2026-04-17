const { Router } = require("express");
const controller = require("../controllers/authController");
const { redirectIfLogged } = require("../middlewares/auth");

const router = Router();

router.get("/login", redirectIfLogged, controller.loginForm);
router.post("/login", controller.login);
router.get("/register", redirectIfLogged, controller.registerForm);
router.post("/register", controller.register);
router.post("/logout", controller.logout);

module.exports = router;
