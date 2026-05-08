const { Usuario } = require("../models");
const { handleControllerError } = require("../middlewares/errorHandler");

// GET /perfil
const getPerfil = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByPk(req.session.usuario.id);

        if (!usuario) {
            return res.status(404).render("404", {
                titulo: "Usuari no trobat"
            });
        }

        res.render("perfil", {
            titulo: "El meu perfil",
            usuario,
            css: "usuarios.css"
        });

    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

module.exports = {
    getPerfil
};
