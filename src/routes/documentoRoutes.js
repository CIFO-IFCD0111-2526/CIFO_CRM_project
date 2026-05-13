const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");
const controller = require("../controllers/documentoController");

const router = Router();

router.use(authPage);


module.exports = router;