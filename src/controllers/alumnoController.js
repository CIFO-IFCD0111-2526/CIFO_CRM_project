const { Op } = require("sequelize");
const { Alumno, Curso } = require("../models");

//GET /alumnos

const getAll = async (req, res, next) => {
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
        next(error);
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

const newAlumno = async (req, res, next) => {
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
        next(error);
    }
};

// GET /alumnos/:id

const getById = async (req, res, next) => {
    try {
        const alumno = await Alumno.findByPk(req.params.id, {
            include: [Curso],
        });

        if (!alumno) {
            req.session.flash = {
                type: "error",
                title: "No trobat",
                message: "L'alumne no existeix.",
            };
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
        next(error);
    }
};

//DELETE/alumnos/:id
const removeAlumno = async (req, res, next) => {
    try {
        const alumno = await Alumno.findByPk(req.params.id);
        if (!alumno) return res.status(404).json({
            ok: false,
            message: "Alumno no trobat"
        });
        await alumno.destroy();
        return res.json({
            ok: true,
            message: "Alumne eliminat correctament"
        });
    } catch (error) {
        next(error);
    }
};

const buscarAlumno = async (req, res, next) => {
    const q = (req.query.q || "").trim();
    const tipo = (req.query.tipo || "").trim().toLowerCase();

    // Si hi ha menys de 2 caràcters → retornem array buit
    if (q.length < 2) {
        return res.json([]);
    }
    // Filtres per tipus d'alumne
    const tiposValidos = ["actual", "antiguo", "futuro"];

    // Construïm el filtre de cerca
    const where = {
        [Op.or]: [
            { nombre: { [Op.like]: `%${q}%` } },
            { apellidos: { [Op.like]: `%${q}%` } },
            { dni: { [Op.like]: `%${q}%` } }
        ]
    };

    // Si el tipus és vàlid, l'afegim al filtre
    if (tiposValidos.includes(tipo)) {
        where.tipo = tipo;
    }
    try {
        const alumnos = await Alumno.findAll({
            where,
            limit: 10,
            order: [["apellidos", "ASC"]],
            attributes: ["id", "nombre", "apellidos", "dni", "tipo"]
        });

        return res.json(alumnos);

    } catch (error) {
        next(error);
    }
};

//PUT /alumnos/:id

const updateAlumno = async (req, res, next) => {
    try {
        const alumno = await Alumno.findByPk(req.params.id);
        if (!alumno) {
            return res.status(404).json({ ok: false, mensaje: "Alumne no trobat" });
        }

        const {
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
        } = req.body;

        if (!nombre || !apellidos || !dni || !tipo) {
            return res.status(400).json({ ok: false, mensaje: "Tots el camps són obligatoris" });
        }

        if (dni !== alumno.dni) {
            const existe = await Alumno.findOne({ where: { dni } });
            if (existe) {
                return res.status(400).json({ ok: false, error: "Ja existeix un altre alumne amb aquest DNI" });
            }
        }

        await alumno.update({
            nombre,
            apellidos,
            dni,
            telefono: telefono || null,
            email: email || null,
            nivel_estudios: nivel_estudios || null,
            tipo,
            derechos_imagen: derechos_imagen === "true" || derechos_imagen === true,
            cesion_material: cesion_material === "true" || cesion_material === true,
            comentarios: comentarios || null,
            ultimo_id_modif: req.session.usuario.id,
        });

        req.session.flash = {
            type: "success",
            title: "Alumne actualitzat",
            message: "Les dades s'han desat correctament.",
        };

        return res.json({ ok: true, redirect: `/alumnos/${req.params.id}` });

    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, createFormPrint, newAlumno, getById, removeAlumno, buscarAlumno, updateAlumno };
