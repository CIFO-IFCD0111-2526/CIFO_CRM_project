const router = require("express").Router();
const { authPage } = require("../middlewares/auth.js")

const authRoutes = require("./authRoutes");
// const alumnoRoutes = require("./alumnoRoutes");
<<<<<<< feat/curso-listar-detalle
const cursoRoutes = require("./cursoRoutes");
//const profesorRoutes = require("./profesorRoutes");
//const ufRoutes = require("./ufRoutes");
//const usuarioRoutes = require("./usuarioRoutes");
=======
// const cursoRoutes = require("./cursoRoutes");
// const profesorRoutes = require("./profesorRoutes");
// const ufRoutes = require("./ufRoutes");
// const usuarioRoutes = require("./usuarioRoutes");

>>>>>>> develop

router.use("/", authRoutes);

// Rutas con sus prefijos
<<<<<<< feat/curso-listar-detalle

//router.use("/alumnos", alumnoRoutes);
router.use("/cursos", cursoRoutes);
//router.use("/ufs", ufRoutes);
//router.use("/profesores", profesorRoutes);
//router.use("/usuarios", usuarioRoutes);

=======
// router.use("/alumnos", alumnoRoutes);
// router.use("/cursos", cursoRoutes);
// router.use("/ufs", ufRoutes);
// router.use("/profesores", profesorRoutes);
// router.use("/usuarios", usuarioRoutes);
>>>>>>> develop

router.get("/", (req, res) => {
  if (req.session.usuario) return res.redirect("/dashboard");
  return res.redirect("/login");
});

// ruta dashboard
router.get("/dashboard", authPage, (req, res) => {
  res.render("dashboard", {usuario: req.session.usuario});
});

module.exports = router;
