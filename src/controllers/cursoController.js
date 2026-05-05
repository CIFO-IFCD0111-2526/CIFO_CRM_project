const { Curso, Alumno, Uf, Profesor } = require("../models");
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
            titulo: "Busqueda de cursos per ID",
            usuario: req.session.usuario,
            css: "cursos.css",
            js: "cursos.js",
            curso
        });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateCurso = async (req, res, next) => {
 try {
    console.log(req.body);
    
    const { data_curso } = req.body ;
    console.log("DATA?",data_curso);


 } catch (error) {
    console.log("ERR:: ", error , " ::ERR")
 }    

    

};
// ho guardem per quan ho necessitem
/* req.session.flash = {
            type: "success",
            title: "Curs editat",
            message: `El curs {Curso.nombre} s'ha modificat correctament.`,
            // keepModal: false, // per si hem de fer recarga quan sortim 
        };

*/
//////////////////////////////////////////////////////////////////////////////////////////////// editarCurso//////////////////////// EDITAR CURSO /////////////////////////////
module.exports = { getAll, getById, crearCurso, renderNuevoCurso, eliminarCurso, updateCurso };
