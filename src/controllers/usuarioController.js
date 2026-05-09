const { Usuario } = require("../models");
const bcrypt = require("bcrypt");
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
            css: "usuarios.css",
            js: "perfil.js",
            flash: res.locals.flash,

        });

    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// PUT /perfil/password
const changePassword = async (req, res, next) => {
    try {
        const { passwordActual, passwordNova } = req.body;
        const usuarioId = req.session.usuario.id;

        const usuario = await Usuario.findByPk(usuarioId);

        if (!usuario) {
            return res.status(404).json({ message: "Usuari no trobat" });
        }

        const match = bcrypt.compareSync(passwordActual, usuario.password);
        if (!match) {
            if (!match) {
                req.session.flash = {
                    type: "error",
                    msg: "La contrasenya actual no és correcta",
                    noModal: true
                };

                return res.json({ ok: false, redirect: "/perfil" });
            }
        }

        const hashed = bcrypt.hashSync(passwordNova, 10);
        usuario.password = hashed;
        await usuario.save();

        req.session.flash = {
            type: "success",
            msg: "Contrasenya canviada correctament",
            noModal: true
        };

        return res.json({ ok: true, redirect: "/perfil" });

    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

module.exports = {
    getPerfil,
    changePassword
};

