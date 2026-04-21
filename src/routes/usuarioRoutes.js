const router = require("express").Router();
const controller = require("../controllers/usuarioController");
const { authPage } = require("../middlewares/auth");

const router = Router();

// Protege todo el router
router.use(authPage);

router.get("/", controller.list);
router.get("/:id", controller.detail);
router.post("/", controller.create);

module.exports = router;