const { Alumno, Curso } = require("../models");

//GET /alumnos

const getAll = async (req, res) => {
    try {
        const alumnos = await Alumno.findAll({
            order: [["apellidos", "ASC"]],
        });
        res.render("alumnos", { "titulo":"Mostrar Alumnos",
            usuario: null,
            css: "alumnos.css",
            js:"alumnos.js",
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

        res.render("alumno-detalle", { "titulo": "AlumnoId",
            usuario: null,
            css: "alumnos.css",    /*Hay que hacer el archivo alumno-detalle.css*/
            alumno       
        }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAll, getById }