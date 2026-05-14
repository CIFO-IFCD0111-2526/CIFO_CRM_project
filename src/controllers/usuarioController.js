const { Usuario } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../config/database"); // Assegura't que la ruta a la teva config de DB és correcta
const { handleControllerError } = require("../middlewares/errorHandler");
const { sendMail } = require("../config/mailer.js");

// GET /perfil
const getPerfil = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByPk(req.session.usuario.id);

        if (!usuario) {
            return res.status(404).render("404", { titulo: "Usuari no trobat" });
        }

        res.render("perfil", {
            titulo: "El meu perfil",
            usuario,
            css: "usuarios.css",
            js: "perfil.js",
        });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// PUT /perfil/password
const changePassword = async (req, res, next) => {
    try {
        const { passwordActual, passwordNova } = req.body;

        if (!passwordActual || !passwordNova) {
            return res.status(400).json({ ok: false, error: "Tots els camps són obligatoris" });
        }

        if (passwordNova.length < 6) {
            return res.status(400).json({ ok: false, error: "La contrasenya nova ha de tenir mínim 6 caràcters" });
        }

        const usuario = await Usuario.findByPk(req.session.usuario.id);

        if (!usuario) {
            return res.status(404).json({ ok: false, error: "Usuari no trobat" });
        }

        if (!bcrypt.compareSync(passwordActual, usuario.password)) {
            return res.status(400).json({ ok: false, error: "La contrasenya actual no és correcta" });
        }

        usuario.password = bcrypt.hashSync(passwordNova, 10);
        await usuario.save();

        req.session.flash = {
            type: "success",
            title: "Contrasenya canviada",
            message: "La contrasenya s'ha actualitzat correctament.",
        };

        return res.json({ ok: true, redirect: "/perfil" });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// PUT /usuarios/:id/aprovar
const aprovarUsuario = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                error: "Usuari no trobat",
            });
        }

        if (usuario.activo) {
            return res.status(400).json({
                ok: false,
                error: "L'usuari ja està aprovat",
            });
        }

        usuario.activo = true;

        await usuario.save();

        try {
            await sendMail({
                to: usuario.email,
                subject: "Compte aprovat",
                html: `
                    <h2>El teu compte ha estat aprovat</h2>
                    <p>
                        Ja pots iniciar sessió a:
                    </p>
                    <p>
                        <a href="${process.env.URL_BASE}/login">
                            ${process.env.URL_BASE}/login
                        </a>
                    </p>
                `,
            });
        } catch (mailError) {
            console.error("Error enviant correu aprovació:", mailError);
        }

        return res.json({ ok: true });

    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

module.exports = { getPerfil, changePassword, aprovarUsuario };
