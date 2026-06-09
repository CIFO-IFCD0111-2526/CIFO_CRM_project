const { Router } = require("express");
const { authPage, requireAdmin } = require("../middlewares/auth.js");
const { loadResource } = require("../middlewares/loadResource.js");
const { Usuario } = require("../models");
const usuarioController = require("../controllers/usuarioController");

const router = Router();

router.use(authPage);

// Accions sobre usuaris (només admin)
router.put(
  "/:id/aprovar",
  requireAdmin,
  loadResource(Usuario, { redirectTo: null }),
  usuarioController.aprovarUsuario
);

router.delete(
  "/:id",
  requireAdmin,
  loadResource(Usuario, { redirectTo: null }),
  usuarioController.rebutjarUsuario
);

module.exports = router;
