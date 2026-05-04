// -------------------------------------------------------
// Controller: Profesores (renderiza vistas)
// -------------------------------------------------------

const { Profesor, Curso } = require("../models");

/** GET /profesores — listar todos */
const listarProfesores = async (req, res, next) => {
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
    next(error);
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
const crearProfesor = async (req, res, next) => {
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
    next(error);
}
};

/** GET /profesores/:id — detall professor */
const getById = async (req, res, next) => {
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
        next(error);
    }
};

/** GET /profesores/:id/editar — detall/editar professor */
const mostrarProfesorEditar = async (req, res, next) => {
    try {
        const profesor = await Profesor.findByPk(req.params.id);
        if (!profesor) {
            return res.redirect("/profesores");
        }
        res.render("profesor-form", {
            titulo: `Editar ${profesor.nombre} ${profesor.apellidos}`,
            usuario: req.session.usuario,
            css: "profesores.css",
            styles: '<link rel="stylesheet" href="/css/forms.css">',
            js: "profesores.js",
            paginaActual: "profesores",
            profesor,
        });
    } catch (error) {
        next(error);
    }
};

/** PUT /profesores/:id — editar professor */
const editarProfesor = async (req, res, next) => {
    try {
        const profesor = await Profesor.findByPk(req.params.id);
        if (!profesor) {
            return res.redirect("/profesores");
        }
        const { nombre, apellidos, telefono, email } = req.body;
        if (!nombre || !apellidos || !email) {
        return res.status(400).json({ ok: false, error: "Nom, cognoms i email són obligatoris." });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ ok: false, error: "Format d'email no vàlid." });
        }
        if (email !== profesor.email) {
            const existe = await Profesor.findOne({ where: { email } });
            if (existe) {
                return res.status(400).json({ ok: false, error: "Ja existeix un professor amb aquest email." });
        }}
        await profesor.update({ nombre, apellidos, telefono: telefono || null, email });
        req.session.flash = {
            type: "success",
            title: "Professor actualitzat",
            message: `El professor ${profesor.nombre} ${profesor.apellidos} s'ha actualitzat correctament.`,
        };

        return res.json({ ok: true, redirect: `/profesores/${profesor.id}` });  
    } catch (error) {
        next(error);
    }
};

module.exports = { listarProfesores, mostrarFormCrear, crearProfesor, getById, mostrarProfesorEditar, editarProfesor };