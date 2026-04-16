// Middleware d'autenticació per a una aplicació Node.js amb Express. Aquest middleware verifica si l'usuari està autenticat abans de permetre l'accés a les rutes protegides.
// Si l'usuari no està autenticat, es redirigeix a la pàgina de login.

function auth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

// Amb sessió iniciada, es pot accedir al dashboard. Al login en cas contrari.

function redirectIfLogged(req, res, next) {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    next();
}

module.exports = {
    auth,
    redirectIfLogged
};







