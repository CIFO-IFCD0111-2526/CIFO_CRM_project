const { Router } = require("express");
const { authPage, requireAdmin } = require("../middlewares/auth.js");
const { loadResource } = require("../middlewares/loadResource.js");
const { Usuario } = require("../models");
const usuarioController = require("../controllers/usuarioController");

const router = Router();

router.use(authPage);

router.get("/", usuarioController.getPerfil);
router.put("/password", usuarioController.changePassword);
router.put("/:id/aprovar",
    requireAdmin,
    loadResource(Usuario, { redirectTo: null }),  //"/dashboard"
    usuarioController.aprovarUsuario
);

router.get(
  "/pendents",  
  requireAdmin,
  usuarioController.getPendents,
);

router.delete(
  "/:id",
  requireAdmin,
  loadResource(Usuario, { redirectTo: null }),
  usuarioController.rebutjarUsuario,
);

module.exports = router;
