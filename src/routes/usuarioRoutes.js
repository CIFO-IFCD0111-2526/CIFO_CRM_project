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
    loadResource(Usuario, { redirectTo: "/dashboard" }),
    usuarioController.aprovarUsuario
);

router.get(
  "pendents",
  loadResource(Usuario, { redirectTo: "/dashboard" }),
  requireAdmin,
  usuarioController.getPendents,
);

router.delete(
  "/usuarios/:id",
  loadResource(Usuario, { redirectTo: "/dashboard" }),
  requireAdmin,
  usuarioController.rebutjarUsuario,
);

module.exports = router;
