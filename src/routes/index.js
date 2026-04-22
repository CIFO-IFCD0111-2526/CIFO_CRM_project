const router = require("express").Router();

const authRoutes = require("./authRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const alumnoRoutes = require("./alumnoRoutes");
const cursoRoutes = require("./cursoRoutes");
<<<<<<< HEAD
const profesorRoutes = require("./profesorRoutes");
const ufRoutes = require("./ufRoutes");
const usuarioRoutes = require("./usuarioRoutes");
const dashboardRoutes = require("./dashboardRoutes");
// const alumnoRoutes = require("./alumnoRoutes");
// const cursoRoutes = require("./cursoRoutes");
// const profesorRoutes = require("./profesorRoutes");
=======
>>>>>>> 189c309 (ref: Updated professors view and added CSS/JS for styling)
const ufRoutes = require("./ufRoutes");
const profesorRoutes = require("./profesorRoutes");
// const usuarioRoutes = require("./usuarioRoutes");


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

module.exports = router;
