const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("CIFO CRM - Servidor OK");
});

module.exports = router;
