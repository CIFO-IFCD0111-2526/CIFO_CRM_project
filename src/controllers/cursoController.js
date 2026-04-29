const { Curso, Alumno, Uf, Profesor } = require("../models");

/** GET /cursos */
const getAll = async (req, res, next) => {
    try {
        const cursos = await Curso.findAll();
        res.render("cursos", {
            titulo: "Busqueda de cursos",
            usuario: req.session.usuario,
            css: "cursos.css",
            js: "cursos.js",
            cursos
        });
    } catch (error) {
        /* res.status(500).json({ error: error.message });*/
        next(error);
    }
};

/** GET /cursos/:id */
const getById = async (req, resl, next) => {
    try {
        const curso = await Curso.findByPk(req.params.id, {
            include: [
                Uf,
                Profesor,
                Alumno
            ],
        });
        /* if (!curso)
            return res.redirect("/cursos");*/
        if (!curso) {
            req.session.flash = {
            type: "error",
            title: "No trobat",
            message: "El curs no existeix.",
        };
        return res.redirect("/cursos");
    }

        res.render("curso-detalle", {
            titulo: "Busqueda de cursos por ID",
            usuario: req.session.usuario,
            css: "cursos.css",
            curso
        });

    } catch (error) {
        /* res.status(500).json({ error: error.message }); */
        next(error);
    }
};

/** Render del formulario de creación de cursos */
const renderNuevoCurso = (req, res) => {
    res.render("curso-form", {
        titulo: "Nou curs",
        usuario: req.session.usuario,
        css: "cursos.css",
        js: "cursos.js",
        paginaActual: "cursos",

    });
};

/** Crear curso (POST) */

const crearCurso = async (req, res) => {
    try {
        const { codigo, nombre, fecha_inicio, fecha_fin, requisitos } = req.body;

        let errores = [];

        if (!codigo) errores.push('El código es obligatorio');
        if (!nombre) errores.push('El nombre es obligatorio');

        // Validar código único
        const existe = await Curso.findOne({ where: { codigo } });
        if (existe) errores.push('El código ya existe');

        if (errores.length > 0) {
            return res.status(400).json({ errores });
        }

        const nuevoCurso = await Curso.create({
            codigo,
            nombre,
            fecha_inicio: fecha_inicio ||null,
            fecha_fin: fecha_fin || null,
            requisitos: requisitos || null
        });

        return res.json({
            ok: true,
            redirect: `/cursos/${nuevoCurso.id}`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ errores: ["Error al crear el curso"] });
    }
};

module.exports = { getAll, getById, crearCurso, renderNuevoCurso };