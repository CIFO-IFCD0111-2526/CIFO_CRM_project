const { Router } = require("express");
const controller = require("../controllers/usuarioController");

const router = Router();

// -------------------------------------------------------
// Rutas: /api/usuarios
// -------------------------------------------------------

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
