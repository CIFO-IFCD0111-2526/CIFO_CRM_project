const router = require("express").Router();
const authRoutes = require("./authRoutes");

router.use("/", authRoutes);

router.get("/", (req, res) => {
  if (req.session.usuario) return res.redirect("/dashboard");
  return res.redirect("/login");
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard",
    {
      titulo: "Inici", /* ¿¿ tauler de control, Pagina principal ?? */
      usuario: req.session.usuario , 
      css: "dashboard.css",
      // js: "dashboard.js",
    }
  );
});

module.exports = router;
