const router = require("express").Router();
const controller = require("../controllers/dashboardController");
const { authPage } = require("../middlewares/auth.js");

router.get("/dashboard", authPage, controller.dashboardPrint);

module.exports = router;