function authPage(req, res, next) {
  if (!req.session.usuario) {
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

module.exports = { authPage, redirectIfLogged };
