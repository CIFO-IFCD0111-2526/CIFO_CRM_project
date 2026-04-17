const router = require("express").Router();
const authRoutes = require("./authRoutes");



router.get("/", (req, res) => {
  if (req.session.usuario) return res.redirect("/dashboard");
  return res.redirect("/login");
});




router.use("/", authRoutes);
module.exports = router;
