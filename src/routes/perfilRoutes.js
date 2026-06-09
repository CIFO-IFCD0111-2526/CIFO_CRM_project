const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");
const usuarioController = require("../controllers/usuarioController");

const router = Router();

router.use(authPage);

// Perfil propi de l'usuari autenticat
router.get("/", usuarioController.getPerfil);
router.put("/password", usuarioController.changePassword);

module.exports = router;
