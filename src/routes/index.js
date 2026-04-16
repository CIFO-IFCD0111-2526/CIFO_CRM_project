// -------------------------------------------------------
// Registro central de rutas
// -------------------------------------------------------

const { Router } = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const authRoutes = require("./authRoutes");
const usuarioRoutes = require("./usuarioRoutes");

const router = Router();

// --- Rutas públicas (no requieren login) ---
router.use("/", authRoutes);

// --- Rutas protegidas (requieren login) ---
router.use("/usuarios", isAuthenticated, usuarioRoutes);

// --- Dashboard ---
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", {
    titulo: "Dashboard",
    usuario: req.session.usuario,
  });
});

// --- Raíz redirige a dashboard ---
router.get("/", isAuthenticated, (req, res) => {
  res.redirect("/dashboard");
});

module.exports = router;
