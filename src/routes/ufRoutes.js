const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");
const controller = require("../controllers/ufController");

const router = Router();

// Todas las rutas de UFs requieren autenticación
router.use(authPage);

router.get("/", controller.getAll);

// GET /ufs/nuevo
router.get("/nuevo", controller.getNuevo);

// POST /ufs
router.post("/", controller.postCrear);
router.get("/:id", controller.getById);
router.delete("/:id", controller.removeUf);

module.exports = router;
