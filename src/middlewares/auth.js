function authPage(req, res, next) {
  if (!req.session.usuario) {
    req.session.flash = {
      type: "error",
      title: "Sessió expirada",
      message: "Has d'iniciar sessió per accedir.",
    };
    return res.redirect("/login");
  }
  next();
}

function redirectIfLogged(req, res, next) {
  if (req.session.usuario) {
    return res.redirect("/dashboard");
  }
  next();
}

function requireAdmin(req, res, next) {
  if (req.session.usuario.nivel_acceso !== "admin") {
    return res.status(403).json({ ok: false, error: "Cal ser admin" });
  }
  next();
}

function requireEditor(req, res, next) {
  if (
    req.session.usuario.nivel_acceso !== "admin" &&
    req.session.usuario.nivel_acceso !== "editor"
  ) {
    return res.status(403).json({
      ok: false,
      error: "Cal ser editor o admin",
    });
  }

  next();
}

module.exports = { authPage, redirectIfLogged, requireAdmin, requireEditor };
