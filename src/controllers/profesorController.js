// -------------------------------------------------------
// Controller: Profesores (renderiza vistas)
// -------------------------------------------------------

const { Op } = require("sequelize");
const { Profesor, Curso } = require("../models");
const { handleControllerError } = require("../middlewares/errorHandler");

/** GET /profesores — listar todos con paginación */
const getAll = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 20));
        const offset = (page - 1) * limit;

        const { count, rows: profesores } = await Profesor.findAndCountAll({
            include: [{
                model: Curso,
                attributes: ["nombre"]
            }],
            order: [["created_at", "DESC"]],
            limit,
            offset,
        });

        const totalPages = Math.ceil(count / limit);

        res.render("profesores", {
            titulo: "Professors",
            usuario: req.session.usuario,
            css: "profesores.css",
            js: "profesores.js",
            paginaActual: "profesores",
            profesores,
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

/** GET /profesores/nuevo — formulari alta */
const renderNewProfesor = (req, res) => {
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
const createProfesor = async (req, res, next) => {
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

        req.session.flash = {
            type: "success",
            title: "Professor creat",
            message: `El professor ${profesor.nombre} ${profesor.apellidos} s'ha creat correctament.`,
        };

        return res.status(201).json({ ok: true, redirect: `/profesores/${profesor.id}` });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

/** GET /profesores/:id — detall professor */
const getById = (req, res) => {
    const profesor = req.profesor;
    res.render("profesor-detalle", {
        titulo: `${profesor.nombre} ${profesor.apellidos}`,
        usuario: req.session.usuario,
        css: "profesores.css",
        js: "profesores.js",
        paginaActual: "profesores",
        profesor,
    });
};

const getEditForm = (req, res) => {
    const profesor = req.profesor;
    res.render("profesor-form", {
        titulo: `Editar ${profesor.nombre} ${profesor.apellidos}`,
        usuario: req.session.usuario,
        css: "profesores.css",
        js: "profesores.js",
        styles: '<link rel="stylesheet" href="/css/forms.css">',
        paginaActual: "profesores",
        profesor,
    });
};

/** PUT /profesores/:id — editar professor */
const updateProfesor = async (req, res, next) => {
    try {
        const profesor = req.profesor;
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
            }
        }
        await profesor.update({ nombre, apellidos, telefono: telefono || null, email });

        req.session.flash = {
            type: "success",
            title: "Professor actualitzat",
            message: `El professor ${profesor.nombre} ${profesor.apellidos} s'ha actualitzat correctament.`,
        };
        return res.json({ ok: true, redirect: `/profesores/${profesor.id}` });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

/** DELETE /profesores/:id — eliminar professor */
const deleteProfesor = async (req, res, next) => {
    try {
        const profesor = req.profesor;
        await profesor.destroy();

        req.session.flash = {
            type: "success",
            title: "Professor eliminat",
            message: `El professor ${profesor.nombre} ${profesor.apellidos} s'ha eliminat correctament.`,
            keepModal: true,
        };

        return res.json({
            ok: true,
            redirect: "/profesores",
        });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

const searchProfesor = async (req, res, next) => {
    const q = (req.query.q || "").trim();

    // Si hi ha menys de 2 caràcters → retornem array buit
    if (q.length < 2) {
        return res.json([]);
    }

    // Construïm el filtre de cerca
    const where = {
        [Op.or]: [
            { nombre: { [Op.like]: `%${q}%` } },
            { apellidos: { [Op.like]: `%${q}%` } },
            { email: { [Op.like]: `%${q}%` } }
        ]
    };

    try {
        const profesores = await Profesor.findAll({
            where,
            limit: 10,
            order: [["apellidos", "ASC"]],
            attributes: ["id", "nombre", "apellidos", "email"]
        });

        return res.json(profesores);

    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

module.exports = { getAll, renderNewProfesor, createProfesor, getById, getEditForm, updateProfesor, deleteProfesor, searchProfesor };
