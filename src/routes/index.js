const router = require("express").Router();
const { authPage } = require("../middlewares/auth.js");

const authRoutes = require("./authRoutes");
const alumnoRoutes = require("./alumnoRoutes");
const cursoRoutes = require("./cursoRoutes");
const profesorRoutes = require("./profesorRoutes");
const ufRoutes = require("./ufRoutes");
const usuarioRoutes = require("./usuarioRoutes");


router.use("/", authRoutes);

// Rutas con sus prefijos
router.use("/alumnos", alumnoRoutes);
router.use("/cursos", cursoRoutes);
router.use("/ufs", ufRoutes);
router.use("/profesores", profesorRoutes);
router.use("/usuarios", usuarioRoutes);

router.get("/", (req, res) => {
  if (req.session.usuario) return res.redirect("/dashboard");
  return res.redirect("/login");
});

// ruta dashboard
router.get("/dashboard", authPage, (req, res) => {
  res.render("dashboard",
    {
      titulo: "Inici", /* ¿¿ tauler de control, Pagina principal ?? */
      usuario: req.session.usuario , 
      css: "dashboard.css",
      js: "dashboard.js",

    }
  );
});

module.exports = router;
