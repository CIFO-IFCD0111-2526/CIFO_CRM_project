const { Comentario } = require("../models");
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

        const comentario = await Comentario.create({
            alumno_id: req.params.alumnoId,
            usuario_id: req.session.usuario.id,
            texto: texto.trim(),
        });

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

        return res.json({
            ok: true,
        });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

module.exports = { create, update, destroy };