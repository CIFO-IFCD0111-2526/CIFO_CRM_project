const { Curso, Alumno, Uf, Profesor } = require("../models");

/** GET /cursos */
const getAll = async (req, res) => {
    try {
        const cursos = await Curso.findAll();
        res.render("cursos", {
            "titulo": "Busqueda de cursos",
            usuario: null,
            css: "cursos.css",
            js: "cursos.js",
            cursos
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/** GET /cursos/:id */
const getById = async (req, res) => {
    try {
        const curso = await Curso.findByPk(req.params.id, {
            include: [
                Uf,
                Profesor,
                Alumno
            ],
        });
        if (!curso)
            return res.redirect("/cursos");
        res.render("curso-detalle", {
            "titulo": "Busqueda de cursos por ID",
            usuario: "null",
            css: "cursos.css",
            curso
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { getAll, getById };