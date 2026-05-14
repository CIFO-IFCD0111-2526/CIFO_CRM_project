const { Router } = require("express");
const { authPage, requireAdmin } = require("../middlewares/auth.js");
const usuarioController = require("../controllers/usuarioController");

const router = Router();

router.use(authPage);

router.get("/", usuarioController.getPerfil);
router.put("/password", usuarioController.changePassword);
router.put("/:id/aprovar", requireAdmin, usuarioController.aprovarUsuario);

module.exports = router;
