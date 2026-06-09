const { Router } = require("express");
const { authPage, requireAdmin } = require("../middlewares/auth.js");
const usuarioController = require("../controllers/usuarioController");

const router = Router();

router.use(authPage);

// Panell d'administració: llista d'usuaris pendents d'activació
router.get("/", requireAdmin, usuarioController.getPendents);

module.exports = router;
