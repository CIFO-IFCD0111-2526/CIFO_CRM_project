const { Op } = require("sequelize");
const { Usuario } = require("../models");
const { handleControllerError } = require("../middlewares/errorHandler");


// GET /perfil
const getPerfil = async (req, res) => {
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
        handleControllerError(res, error, "Error carregant el perfil");
    }
};

module.exports = {
    getPerfil
};