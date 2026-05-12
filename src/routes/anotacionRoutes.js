const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");
const controller = require("../controllers/anotacionController");

const router = Router();

router.use(authPage);

router.post("/", controller.create);

module.exports = router;
