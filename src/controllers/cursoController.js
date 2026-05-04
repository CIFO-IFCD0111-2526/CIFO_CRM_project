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
       next(error);
    }
};

/** GET /cursos/:id */
const getById = async (req, res, next) => {
    try {
        const curso = await Curso.findByPk(req.params.id, {
            include: [
                Uf,
                Profesor,
                Alumno
            ],
        });
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
            js: "cursos.js",
            curso
        });
    } catch (error) {
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

const crearCurso = async (req, res, next) => {
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
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null,
            requisitos: requisitos || null
        });

        req.session.flash = {
            type: "success",
            title: "Curs creat",
            message: `El curs ${nuevoCurso.nombre} s'ha creat correctament.`,
        };

        return res.json({
            ok: true,
            redirect: `/cursos/${nuevoCurso.id}`
        });

    } catch (error) {
        next(error);
    }
};

// DELETE /cursos/:id

const eliminarCurso = async (req, res, next) => {
    try {
        const id = req.params.id;
        const curso = await Curso.findByPk(id);
        if (!curso) {
            return res.status(404).json({
                ok: false,
                message: "El curs no existeix"
            });
        }
        await curso.destroy();
        req.session.flash = {
            type: "success",
            title: "Curs eliminat",
            message: "El curs s'ha eliminat correctament."
        };
        return res.json({
            ok: true,
            redirect: "/cursos"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, crearCurso, renderNuevoCurso, eliminarCurso };