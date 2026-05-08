const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");
const usuarioController = require("../controllers/usuarioController");

const router = Router();

router.use(authPage);

router.get("/", usuarioController.getPerfil);
router.put(
    "/perfil/password",
    authPage,
    usuarioController.changePassword
);

module.exports = router;
