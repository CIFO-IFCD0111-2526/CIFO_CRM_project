const { Router } = require("express");
const { authPage } = require("../middlewares/auth");
const { loadResource } = require("../middlewares/loadResource.js");
const { Comentario } = require("../models");

const controller = require("../controllers/comentarioController");

const router = Router({
    mergeParams: true,
});

// Todas las rutas requieren autenticación
router.use(authPage);

router.post("/", controller.create);

router.put("/:id", loadResource(Comentario, { ownerField: "usuario_id" }),
    controller.update
);

router.delete("/:id", loadResource(Comentario, { ownerField: "usuario_id" }),
    controller.destroy
);

module.exports = router;
