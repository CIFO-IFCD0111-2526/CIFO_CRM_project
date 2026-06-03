const { Anotacion } = require("../models");
const { handleControllerError } = require("../middlewares/errorHandler");

// POST /anotaciones
const create = async (req, res, next) => {
    try {
        const { contenido } = req.body;

        if (!contenido || !contenido.trim()) {
            return res.status(400).json({ ok: false, error: "El contingut és obligatori." });
        }

        await Anotacion.create({
            usuario_id: req.session.usuario.id,
            contenido: contenido.trim(),
        });

        req.session.flash = {
            type: "success",
            title: "Anotació creada",
            message: "L'anotació s'ha creat correctament.",
        };

        return res.json({ ok: true, redirect: "/dashboard" });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// PUT /anotacions/:id
const update = async (req, res, next) => {
    try {
        const { contenido } = req.body;

        if (!contenido || !contenido.trim()) {
            return res.status(400).json({ ok: false, error: "El contingut és obligatori." });
        }

        await req.anotacion.update({ contenido: contenido.trim() });

        req.session.flash = {
            type: "success",
            title: "Anotació actualitzada",
            message: "L'anotació s'ha actualitzat correctament.",
        };

        return res.json({ ok: true, redirect: "/dashboard" });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// DELETE /anotacions/:id
const destroy = async (req, res, next) => {
    try {
        await req.anotacion.destroy();

        req.session.flash = {
            type: "success",
            title: "Anotació eliminada",
            message: "L'anotació s'ha eliminat correctament.",
        };

        return res.json({ ok: true, redirect: "/dashboard" });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

module.exports = { create, update, destroy };
