const { Comentario, Alumno } = require("../models");
const { handleControllerError } = require("../middlewares/errorHandler");

// POST /alumnos/:alumnoId/comentarios

const create = async (req, res, next) => {
    try {
        const { texto } = req.body;

        if (!texto || !texto.trim()) {
            return res.status(400).json({
                ok: false,
                error: "El comentari és obligatori.",
            });
        }

        // Comprovem que l'alumne existeix abans de crear el comentari
        // (evita comentaris orfes amb un alumno_id inexistent).
        const alumno = await Alumno.findByPk(req.params.alumnoId);
        if (!alumno) {
            return res.status(404).json({
                ok: false,
                error: "L'alumne no existeix.",
            });
        }

        const comentario = await Comentario.create({
            alumno_id: req.params.alumnoId,
            usuario_id: req.session.usuario.id,
            texto: texto.trim(),
        });

        req.session.flash = {
            type: "success",
            title: "Comentari afegit",
            message: "El comentari s'ha afegit correctament.",
        };

        return res.json({
            ok: true,
            comentario,
        });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// PUT /comentarios/:id
const update = async (req, res, next) => {
    try {
        const { texto } = req.body;

        if (!texto || !texto.trim()) {
            return res.status(400).json({
                ok: false,
                error: "El comentari és obligatori.",
            });
        }

        await req.comentario.update({
            texto: texto.trim(),
        });

        req.session.flash = {
            type: "success",
            title: "Comentari actualitzat",
            message: "El comentari s'ha actualitzat correctament.",
        };

        return res.json({
            ok: true,
            comentario: req.comentario,
        });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// DELETE /comentarios/:id
const destroy = async (req, res, next) => {
    try {
        await req.comentario.destroy();

        req.session.flash = {
            type: "success",
            title: "Comentari eliminat",
            message: "El comentari s'ha eliminat correctament.",
        };

        return res.json({
            ok: true,
        });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

module.exports = { create, update, destroy };
