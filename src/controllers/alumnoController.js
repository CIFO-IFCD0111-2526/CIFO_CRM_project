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
    usuario: req.session.usuario,
    css: "alumnos.css",
    js: "alumnos.js",
    paginaActual: "alumnos",
  });
};

// POST /alumnos

const newAlumno = async (req, res) => {
  const { nombre, apellidos, dni , telefono, email, nivel_estudios, tipo, derechos_imagen, cesion_material, comentarios } = req.body;

  // Validación básica
  if (!nombre || !apellidos || !dni || !tipo) { // SE PUEDEN AGREGAR MÁS O QUITAR SEGÚN NECESIDAD
    return res.status(400).json({ error: "Tots els camps són obligatoris." });
  }

  try {
    // Comprobar dni único
    const existe = await Alumno.findOne({ where: { dni } });
    if (existe) {
      return res.status(400).json({ error: "L'alumne ja està registrat." });
    }

    // Crear alumno
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
      ultimo_id_modif : req.session.usuario.id,
    });

    return res.status(200).json({ ok: true, redirect: "/alumnos/nuevo" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor." });
  }
};


module.exports = { getAll, getById, createFormPrint, newAlumno }