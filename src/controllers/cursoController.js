const { Curso, Alumno,CursoAlumno, Uf, Profesor } = require("../models");
const { Op } = require("sequelize");

const { handleControllerError } = require("../middlewares/errorHandler");
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
        return handleControllerError(error, res, next);
    }
};

/** GET /cursos/:id */
const getById = (req, res) => {
    res.render("curso-detalle", {
        titulo: "Busqueda de cursos per ID",
        usuario: req.session.usuario,
        css: "cursos.css",
        js: "cursos.js",
        curso: req.curso
    });
};

/** Render del formulario de creación de cursos */
const renderNewCurso = (req, res) => {
    res.render("curso-form", {
        titulo: "Nou curs",
        usuario: req.session.usuario,
        css: "cursos.css",
        js: "cursos.js",
        paginaActual: "cursos",
    });
};

/** Crear curso (POST) */

const createCurso = async (req, res, next) => {
    try {
        const { codigo, nombre, fecha_inicio, fecha_fin, requisitos } = req.body;

        let errores = [];

        if (!codigo) errores.push('El codi és obligatori');
        if (!nombre) errores.push('El nom és obligatori');

        // Validar código único
        const existe = await Curso.findOne({ where: { codigo } });
        if (existe) errores.push('El codi ja existeix');

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
        return handleControllerError(error, res, next);
    }
};

/** GET /cursos/buscar?q=... */
const searchCurso = async (req, res, next) => {
    try {
        const q = (req.query.q || "").trim();

        // Si hi ha menys de 2 caràcters → retornem array buit
        if (q.length < 2) {
            return res.json([]);
        }

        // Construïm el filtre de cerca
        const where = {
            [Op.or]: [
                { nombre: { [Op.like]: `%${q}%` } },
                { codigo: { [Op.like]: `%${q}%` } }
            ]
        };

        const cursos = await Curso.findAll({
            where,
            limit: 10,
            order: [["codigo", "ASC"]],
            attributes: ["id", "codigo", "nombre", "fecha_inicio", "fecha_fin"]
        });

        return res.json(cursos);

    } catch (error) {
        return handleControllerError(error, res, next);
    }
};


// DELETE /cursos/:id
const deleteCurso = async (req, res, next) => {
    try {
        const curso = req.curso;
        await curso.destroy();

        req.session.flash = {
            type: "success",
            title: "Curs eliminat",
            message: "El curs s'ha eliminat correctament."
        };

        return res.json({ ok: true, redirect: "/cursos" });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// PUT /cursos/:id
const updateCurso = async (req, res, next) => {
    try {
        const curso = req.curso;
        const { codigo, nombre, fecha_inicio, fecha_fin, requisitos } = req.body;

        if (!codigo || !nombre) {
            return res.status(400).json({ ok: false, mensaje: "Tots els camps són obligatoris" });
        }

        if (codigo !== curso.codigo) {
            const existe = await Curso.findOne({ where: { codigo } });
            if (existe) {
                return res.status(400).json({ ok: false, error: "Ja existeix un altre curs amb aquest codi" });
            }
        }

        await curso.update({
            codigo,
            nombre,
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null,
            requisitos: requisitos !== undefined && requisitos !== "" ? Number(requisitos) : null,
        });

        req.session.flash = {
            type: "success",
            title: "Curs actualitzat",
            message: `El curs ${curso.nombre} s'ha actualitzat correctament.`,
        };

        return res.json({ ok: true, redirect: `/cursos/${curso.id}` });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};
// Post/:id/alumnos
const addAlumnoToCurso = async (req, res, next) => {
    try {
        const cursoId = req.params.id;
        const { alumnoId } = req.body;

        if (!alumnoId) {
            return res.status(400).json({
                ok: false,
                error: "Falta alumnoId"
            });
        }
        const curso = await Curso.findByPk(cursoId);
        if (!curso) {
            return res.status(404).json({
                ok: false,
                error: "Curs no trobat"
            });
        }
        const exists = await CursoAlumno.findOne({
            where: {
                curso_id: cursoId,
                alumno_id: alumnoId
            }
        });

        if (exists) {
            return res.status(400).json({
                ok: false,
                error: "Aquest alumne ja està matriculat en aquest curs"
            });
        }
        await CursoAlumno.create({
            curso_id: cursoId,
            alumno_id: alumnoId,
            estat: false
        });

        return res.json({
            ok: true
        });

    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// DELETE /cursos/:cursoId/alumnos/:alumnoId
const deleteAlumnoFromCurso = async (req, res, next) => {

    try {

        const { cursoId, alumnoId } = req.params;

        const matricula = await CursoAlumno.findOne({
            where: {
                curso_id: cursoId,
                alumno_id: alumnoId,
            }
        });

        if (!matricula) {

            return res.status(404).json({
                ok: false,
                error: "La matrícula no existeix"
            });

        }

        await matricula.destroy();

        return res.json({
            ok: true
        });

    } catch (error) {

        return handleControllerError(error, res, next);

    }

};
module.exports = { getAll, getById, createCurso, renderNewCurso,searchCurso, deleteCurso, updateCurso,addAlumnoToCurso,deleteAlumnoFromCurso };
