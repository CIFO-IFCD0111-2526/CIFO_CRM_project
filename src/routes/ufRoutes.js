const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");
const controller = require("../controllers/ufController");

const router = Router();

// Todas las rutas de UFs requieren autenticación
router.use(authPage);

router.get("/", controller.getAll);
router.get("/nuevo", controller.getNuevo);
router.get("/:id/editar", controller.getEditar);
router.put("/:id", controller.putActualizar);
router.post("/", controller.postCrear);

module.exports = router;
