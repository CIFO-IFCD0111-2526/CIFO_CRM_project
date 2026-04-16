// -------------------------------------------------------
// Middleware: auth
// -------------------------------------------------------
// Protege rutas que requieren sesión iniciada.
// Si el usuario no ha hecho login, lo redirige a /login.
//
// Uso en routes:
//   const { isAuthenticated } = require("../middlewares/auth");
//   router.get("/dashboard", isAuthenticated, controller.dashboard);
// -------------------------------------------------------

function isAuthenticated(req, res, next) {
  // req.session.usuario se crea al hacer login (ver authController)
  if (req.session && req.session.usuario) {
    return next(); // tiene sesión : puede pasar
  }
  res.redirect("/login"); // no tiene sesión → al login
}

module.exports = { isAuthenticated };
