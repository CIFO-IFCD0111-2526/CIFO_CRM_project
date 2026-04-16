const router = require("express").Router();

router.use("/", authRoutes);

router.get("/", (req, res) => {
  res.send("CIFO CRM - Servidor OK");
});

module.exports = router;