const { Router } = require("express");
const { authPage, requireEditor } = require("../middlewares/auth");
const { loadResource } = require("../middlewares/loadResource.js");
const { Comentario } = require("../models");

const controller = require("../controllers/comentarioController");

const router = Router({
    mergeParams: true,
});

// Todas las rutas requieren autenticación.
// Totes les rutes de comentaris són d'escriptura: el rol lector no hi té accés.
router.use(authPage);
router.use(requireEditor);

router.post("/", controller.create);

router.put("/:id", loadResource(Comentario, { ownerField: "usuario_id" }),
    controller.update
);

router.delete("/:id", loadResource(Comentario, { ownerField: "usuario_id" }),
    controller.destroy
);

module.exports = router;
