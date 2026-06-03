const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");
const { loadResource } = require("../middlewares/loadResource.js");
const { Anotacion } = require("../models");
const controller = require("../controllers/anotacionController");

const router = Router();

router.use(authPage);

router.post("/", controller.create);

router.put(
    "/:id",
    loadResource(Anotacion, { redirectTo: "/dashboard", ownerField: "usuario_id" }),
    controller.update
);

router.delete(
    "/:id",
    loadResource(Anotacion, { redirectTo: "/dashboard", ownerField: "usuario_id" }),
    controller.destroy
);


module.exports = router;
