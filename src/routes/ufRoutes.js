const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");
const controller = require("../controllers/ufController");
const { loadResource } = require("../middlewares/loadResource.js");
const { Uf, Curso } = require("../models");

const router = Router();

// Todas las rutas de UFs requieren autenticación
router.use(authPage);

router.get("/", controller.getAll);
router.get("/nuevo", controller.renderNewUf);
router.post("/", controller.createUf);
router.get("/:id",
    loadResource(Uf, { redirectTo: "/ufs", include: [Curso] }),
    controller.getById
);
router.get("/:id/editar",
    loadResource(Uf, { redirectTo: "/ufs" }),
    controller.getEditForm
);
router.put("/:id",
    loadResource(Uf, { redirectTo: "/ufs" }),
    controller.updateUf
);
router.delete("/:id",
    loadResource(Uf, { redirectTo: "/ufs" }),
    controller.deleteUf
);

module.exports = router;
