const router = require("express").Router();
const authRoutes = require("./authRoutes");

router.use("/", authRoutes);

router.get("/", (req, res) => {
  res.send("CIFO CRM - Servidor OK");
});

module.exports = router;
