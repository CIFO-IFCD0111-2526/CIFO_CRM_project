const { Router } = require("express");
const controller = require("../controllers/alumnoController");
const { authPage } = require("../middlewares/auth");

const router = Router();

// Middleware aplicado a TODO el router
router.use(authPage);

router.get("/", controller.list);
router.get("/:id", controller.detail);
router.post("/", controller.create);

module.exports = router;