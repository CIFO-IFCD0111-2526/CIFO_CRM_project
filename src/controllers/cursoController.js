const { Curso, Alumno,CursoAlumno, Profesor } = require("../models");
const { Op } = require("sequelize");
const { handleControllerError } = require("../middlewares/errorHandler");
const { ValidationError, UniqueConstraintError } = require("sequelize");

/** GET /cursos con paginacion */
const getAll = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
        const offset = (page - 1) * limit;

        const { count, rows: cursos } = await Curso.findAndCountAll({
            order: [["created_at", "DESC"]],
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        res.render("cursos", {
            titulo: "Busqueda de cursos",
            usuario: req.session.usuario,
            css: "cursos.css",
            js: "cursos.js",
            cursos,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: count,
                limit,
            }
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
        const { codigo_curso,codigo_accion_formativa, nombre, fecha_inicio, fecha_fin, nivel } = req.body;

        let errores = [];

        if (!codigo_curso) errores.push('El codi és obligatori');
        if (!codigo_accion_formativa) errores.push("El codi d'acció formativa és obligatori");
        if (!nombre) errores.push('El nom és obligatori');

        // Validar código único
        const existe = await Curso.findOne({ where: { codigo_accion_formativa } });
        if (existe) errores.push('El codi ja existeix');

        if (errores.length > 0) {
            return res.status(400).json({ errores });
        }

        const nuevoCurso = await Curso.create({
            codigo_curso,
            codigo_accion_formativa,
            nombre,
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null,
            nivel: nivel || null
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
                { codigo_curso: { [Op.like]: `%${q}%` } },
                { codigo_accion_formativa: { [Op.like]: `%${q}%` } }
            ]
        };

        const cursos = await Curso.findAll({
            where,
            limit: 10,
            order: [["codigo_accion_formativa", "DESC"]],
            attributes: ["id", "codigo_curso","codigo_accion_formativa", "nombre", "fecha_inicio", "fecha_fin"]
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
        const { codigo_curso,codigo_accion_formativa, nombre, fecha_inicio, fecha_fin, nivel } = req.body;

        if (!codigo_curso || !nombre || !codigo_accion_formativa) {
            return res.status(400).json({ ok: false, mensaje: "Tots els camps són obligatoris" });
        }

        if (codigo_accion_formativa !== curso.codigo_accion_formativa) {
            const existe_fecha = await Curso.findOne({ where: { codigo_accion_formativa } });
            if (existe_fecha) {
                return res.status(400).json({ ok: false, error: "Ja existeix un altre curs amb aquest codi" });
            }
        }
        await curso.update({
            codigo_curso,
            codigo_accion_formativa,
            nombre,
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null,
            nivel: nivel !== undefined && nivel !== "" ? Number(nivel) : null,
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
// POST /cursos/:id/alumnos
const addAlumnoToCurso = async (req, res, next) => {
    try {
        const curso = req.curso;
        const { alumnoId } = req.body;

        if (!alumnoId) {
            return res.status(400).json({ ok: false, error: "Falta alumnoId" });
        }

        const exists = await CursoAlumno.findOne({
            where: { curso_id: curso.id, alumno_id: alumnoId }
        });

        if (exists) {
            return res.status(400).json({ ok: false, error: "Aquest alumne ja està matriculat en aquest curs" });
        }

        await CursoAlumno.create({
            curso_id: curso.id,
            alumno_id: alumnoId,
            estat: false
        });

        return res.json({ ok: true });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// DELETE /cursos/:cursoId/alumnos/:alumnoId
const deleteAlumnoFromCurso = async (req, res, next) => {
    try {
        const { cursoId, alumnoId } = req.params;

        const matricula = await CursoAlumno.findOne({
            where: { curso_id: cursoId, alumno_id: alumnoId }
        });

        if (!matricula) {
            return res.status(404).json({ ok: false, error: "La matrícula no existeix" });
        }

        await matricula.destroy();
        return res.json({ ok: true });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};
// POST /cursos/:id/profesores
const asignarProfesor = async (req, res, next) => {

    try {
        const curso_id = parseInt(req.params.id);
        const profesor_id  = req.body.profesor_id;
        console.log(curso_id, profesor_id);
        

        // LÓGICA DE ASIGNAR PROFESOR

        const cursoInsert = await Curso.findByPk(curso_id);
        //console.log(cursoInsert);
        const profesorInsert = await Profesor.findByPk(profesor_id);
        //console.log(profesorInsert);
        //console.log(cursoInsert.nombre, profesorInsert.nombre);
        const relExists = await curso_profesor.findAll({ where: { curso_id: curso_id, profesor_id: profesor_id} });
        console.log("exist", relExists);

        if (!cursoInsert || !profesorInsert) { 
            console.log("PARAMETROS INCORRECTOS, RESPONSE A DEFINIR.");
            throw new Error("Curso o profesor no existen");
        } else if (relExists.length > 0) {
            throw new Error(`El profesor ya está asignado al curso ${cursoInsert.nombre}`);
            // throw new UniqueConstraintError({ message: `El profesor ya está asignado al curso ${cursoInsert.nombre}` }); // A UTILIZAR CUANDO EL MIDDLEWARE ERRORHANDLER.JS FUNCIONE.
        };

        cursoInsert.addProfesor(profesorInsert);

        req.session.flash = {
            type: "success",
            title: "Professor assignat correctament.",
            message: `El curs ${cursoInsert.nombre} s'ha actualitzat correctament.`,
        };

        return res.json({ ok: true, redirect: `/cursos/${curso_id}` });

        } catch (error) {
        return handleControllerError(error, res, next);
    }
};

//DELETE /cursos/:id/profesores/:profesorId
const desasignarProfesor = async (req, res, next) => {

    try {
        const curso_id = parseInt(req.params.id);
        const profesor_id  = parseInt(req.params.profesorId);
        console.log(curso_id, profesor_id);        

        // LÓGICA DE DESASIGNAR PROFESOR

        const cursoDelete = await Curso.findByPk(curso_id);
        //console.log(cursoDelete);
        const profesorDelete = await Profesor.findByPk(profesor_id);
        //console.log(profesorDelete);
        //console.log(cursoDelete.nombre, profesorDelete.nombre);
        const relExists = await curso_profesor.findAll({ where: { curso_id: curso_id, profesor_id: profesor_id} });
        console.log("exist", relExists);

        if (!cursoDelete || !profesorDelete) { 
            console.log("PARAMETROS INCORRECTOS, RESPONSE A DEFINIR.");
            throw new Error("Curso o profesor no existen");
        } else if (relExists.length === 0) {
            throw new Error(`El profesor ya no está asignado al curso ${cursoDelete.nombre}`);
        };
        
        cursoDelete.removeProfesor(profesorDelete);

        req.session.flash = {
            type: "success",
            title: "Professor desassignat correctament.",
            message: `El curs ${cursoDelete.nombre} s'ha actualitzat correctament.`,
        };

        return res.json({ ok: true, redirect: `/cursos/${curso_id}` });

        } catch (error) {
        return handleControllerError(error, res, next);
    }
};

module.exports = { getAll, getById, createCurso, renderNewCurso, searchCurso, deleteCurso, updateCurso, asignarProfesor, desasignarProfesor, addAlumnoToCurso, deleteAlumnoFromCurso };
