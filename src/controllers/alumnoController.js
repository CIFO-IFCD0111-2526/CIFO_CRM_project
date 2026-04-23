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

// GET /alumnos/nuevo

const createFormPrint = async (req, res) => {
    res.render("alumno-form", {
        titulo: "Nou alumne",
        usuario: req.session.usuario,
        css: "alumnos.css",
        js: "alumnos.js",
        paginaActual: "alumnos",
    });
};

// POST /alumnos

const newAlumno = async (req, res) => {
    const { nombre, apellidos, dni, telefono, email, nivel_estudios, tipo, derechos_imagen, cesion_material, comentarios } = req.body;

    if (!nombre || !apellidos || !dni || !tipo) {
        return res.status(400).json({ error: "Tots els camps són obligatoris." });
    }

    try {
        const existe = await Alumno.findOne({ where: { dni } });
        if (existe) {
            return res.status(400).json({ error: "L'alumne ja està registrat." });
        }

        await Alumno.create({
            nombre,
            apellidos,
            dni,
            telefono,
            email,
            nivel_estudios,
            tipo,
            derechos_imagen,
            cesion_material,
            comentarios,
            ultimo_id_modif: req.session.usuario.id,
        });

        return res.status(200).json({ ok: true, redirect: "/alumnos" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor." });
    }
};

// GET /alumnos/:id

const getById = async (req, res) => {
    try {
        const alumno = await Alumno.findByPk(req.params.id, {
            include: [Curso],
        });

        if (!alumno) {
            return res.redirect("/alumnos");
        }

        res.render("alumno-detalle", {
            titulo: "Detall d'alumne",
            usuario: req.session.usuario,
            css: "alumnos.css",
            js: "alumnos.js",
            alumno
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//DELETE/alumnos/:id
const removeAlumno = async (req, res) => {
    try {
        const alumno = await Alumno.findByPk(req.params.id);
        if (!alumno) return res.status(404).json({
            ok: false,
            message: "Alumno no trobat"
        });
        await alumno.destroy();
        return res.json({
            ok: true,
            message:"Alumne eliminat correctament"
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            message:"Error eliminant alumne"});
    }

};


module.exports = { getAll, createFormPrint, newAlumno, getById, removeAlumno }
