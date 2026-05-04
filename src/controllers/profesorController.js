// -------------------------------------------------------
// Controller: Profesores (renderiza vistas)
// -------------------------------------------------------

const { Profesor, Curso, CursoProfesor } = require("../models");
const { sequelize } = require("../config/database");

/** GET /profesores — listar todos */
const listarProfesores = async (req, res) => {
    try {
        const profesores = await Profesor.findAll({
            include: [{
                model: Curso,
                attributes: ["nombre"]
            }],
            order: [["id", "ASC"]],
        });

        res.render("profesores", {
            titulo: "Professors",
            usuario: req.session.usuario,
            css: "profesores.css",
            js: "profesores.js",
            paginaActual: "profesores",
            profesores,
        });
    } catch (error) {
        res.status(500).send("Error al cargar profesores: " + error.message);
    }
};

/** GET /profesores/nuevo — formulari alta */
const mostrarFormCrear = (req, res) => {
    res.render("profesor-form", {
        titulo: "Nou professor",
        usuario: req.session.usuario,
        css: "profesores.css",
        js: "profesores.js",
        paginaActual: "profesores",
        styles: '<link rel="stylesheet" href="/css/forms.css">',
    });
};

/** POST /profesores — crear professor */
const crearProfesor = async (req, res) => {
    const { nombre, apellidos, telefono, email } = req.body;

    if (!nombre || !apellidos || !email) {
        return res.status(400).json({ ok: false, error: "Nom, cognoms i email són obligatoris." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ ok: false, error: "Format d'email no vàlid." });
    }

    try {
        const existe = await Profesor.findOne({ where: { email } });
        if (existe) {
            return res.status(400).json({ ok: false, error: "Ja existeix un professor amb aquest email." });
        }

        const profesor = await Profesor.create({
            nombre,
            apellidos,
            telefono: telefono || null,
            email,
        });

        return res.status(201).json({ ok: true, redirect: `/profesores/${profesor.id}` });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({ ok: false, error: error.errors[0].message });
        }
        console.error(error);
        return res.status(500).json({ ok: false, error: "Error del servidor." });
    }
};

/** GET /profesores/:id — detall professor */
const getById = async (req, res) => {
    try {
        const profesor = await Profesor.findByPk(req.params.id, {
            include: [{ model: Curso, attributes: ["id", "codigo", "nombre"] }],
        });

        if (!profesor) {
            return res.redirect("/profesores");
        }

        res.render("profesor-detalle", {
            titulo: `${profesor.nombre} ${profesor.apellidos}`,
            usuario: req.session.usuario,
            css: "profesores.css",
            js: "profesores.js",
            paginaActual: "profesores",
            profesor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProfesor = async (req, res) => {
  const { id } = req.params;

  try {
    const profesor = await Profesor.findByPk(id);

    if (!profesor) {
      return res.status(404).json({
        ok: false,
        message: "Profesor no encontrado",
      });
    }

    // eliminar relaciones
    await CursoProfesor.destroy({
      where: { profesor_id: id },
    });

    // eliminar profesor
    await profesor.destroy();

    return res.json({
      ok: true,
      redirect: "/profesores",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false });
  }
};


module.exports = { listarProfesores, mostrarFormCrear, crearProfesor, getById, deleteProfesor };