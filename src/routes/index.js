const router = require("express").Router();

const authRoutes = require("./authRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const alumnoRoutes = require("./alumnoRoutes");
const cursoRoutes = require("./cursoRoutes");
const profesorRoutes = require("./profesorRoutes");
const usuarioRoutes = require("./usuarioRoutes");
const anotacionRoutes = require("./anotacionRoutes");
const documentoRoutes =require("./documentoRoutes");
const comentarioRoutes = require("./comentarioRoutes");

router.use("/", authRoutes, dashboardRoutes);

// Rutas con sus prefijos
router.use("/alumnos", alumnoRoutes);
router.use("/cursos", cursoRoutes);
router.use("/profesores", profesorRoutes);
router.use("/perfil", usuarioRoutes);
router.use("/anotaciones", anotacionRoutes);
router.use("/documentos",documentoRoutes);
router.use("/alumnos/:alumnoId/comentarios", comentarioRoutes);
router.use("/comentarios", comentarioRoutes);

router.get("/", (req, res) => {
  if (req.session.usuario) return res.redirect("/dashboard");
  return res.redirect("/login");
});

module.exports = router;