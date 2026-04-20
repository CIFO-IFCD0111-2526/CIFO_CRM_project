const router = require("express").Router();

const authRoutes = require("./authRoutes");
<<<<<<< HEAD
const dashboardRoutes = require("./dashboardRoutes");
const alumnoRoutes = require("./alumnoRoutes");
const cursoRoutes = require("./cursoRoutes");
const profesorRoutes = require("./profesorRoutes");
const ufRoutes = require("./ufRoutes");
const usuarioRoutes = require("./usuarioRoutes");
=======
// const alumnoRoutes = require("./alumnoRoutes");
// const cursoRoutes = require("./cursoRoutes");
// const profesorRoutes = require("./profesorRoutes");
// const ufRoutes = require("./ufRoutes");
// const usuarioRoutes = require("./usuarioRoutes");
>>>>>>> 0a5d9a2 (temporal_fix: comentadas importaciones de routes que apuntan a ficheros vacíos y sus correspondientes '.use'.)

router.use("/", authRoutes, dashboardRoutes);

// Rutas con sus prefijos
router.use("/alumnos", alumnoRoutes);
router.use("/cursos", cursoRoutes);
router.use("/ufs", ufRoutes);
router.use("/profesores", profesorRoutes);
// router.use("/usuarios", usuarioRoutes);

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
