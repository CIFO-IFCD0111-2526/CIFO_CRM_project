const { Alumno, Curso } = require("../models");

//GET /alumnos

const getAll = async (req, res) => {
    try {
        const alumnos = await Alumno.findAll({
            order: [["apellidos", "ASC"]],
        });
        res.render("alumnos", {
            titulo: "Mostrar Alumnos",
            usuario: req.session.usuario,
            css: "alumnos.css",
            js: "alumnos.js",
            alumnos
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /alumnos/:id

const getById = async (req, res) => {
    try {
        const alumno = await Alumno.findByPk(req.params.id, { 
            include:[Curso],
        });

        if (!alumno) {
            return res.redirect("/alumnos");
        }

        res.render("alumno-detalle", {
            titulo: "Detall d'alumne",
            usuario: req.session.usuario,
            css: "alumnos.css",
            alumno
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /alumnos/nuevo

const createFormPrint = async (req, res) => {
    res.render("alumno-form", {
    titulo: "Nou alumne",
    css: "alumnos.css",
    // css: "forms.css",
    js: "alumnos.js",
    paginaActual: "alumnos",
  });
};

module.exports = { getAll, getById, createFormPrint }