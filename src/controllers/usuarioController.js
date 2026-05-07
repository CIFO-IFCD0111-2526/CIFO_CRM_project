const usuarioController = {
    login(req, res) {
        res.render("login");
    },

    perfil(req, res) {
        res.render("perfil");
    }
};

module.exports = usuarioController;
