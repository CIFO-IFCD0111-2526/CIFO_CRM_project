const router = require("express").Router();
const authRoutes = require("./authRoutes");

router.use("/", authRoutes);

router.get("/", (req, res) => {
  if (req.session.usuario) return res.redirect("/dashboard");
  return res.redirect("/login");
});


module.exports = router;
