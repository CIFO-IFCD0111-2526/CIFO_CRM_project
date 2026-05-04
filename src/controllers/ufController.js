const { Uf, Curso } = require("../models");

// GET /ufs
const getAll = async (req, res) => {
    try {
        const ufs = await Uf.findAll({
            include: [{ model: Curso, attributes: ["id", "codigo", "nombre"] }],
            order: [["codigo", "ASC"]],
        });

        res.render("ufs", {
            titulo: "UFs",
            usuario: req.session.usuario,
            css: "ufs.css",
            js: "ufs.js",
            ufs,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /ufs/nuevo
const getNuevo = (req, res) => {
    res.render("uf-form", {
        titulo: "Nova UF",
        usuario: req.session.usuario,
        css: "ufs.css",
        js: "ufs.js",
        paginaActual: "ufs",
        uf: {},
        errores: {},
    });
};

// GET /ufs/:id/editar
const getEditar = async (req, res) => {
    const { id } = req.params;

    const uf = await Uf.findByPk(id);

    if (!uf) {
        return res.redirect("/ufs");
    }

    res.render("uf-form", {
        titulo: "Editar UF",
        usuario: req.session.usuario,
        paginaActual: "ufs",
        css: "ufs.css",
        js: "ufs.js",
        uf,
        errores: {},
    });
};

// PUT /ufs/:id
const putActualizar = async (req, res) => {
    const { id } = req.params;
    const { codigo, nombre, horas } = req.body;
    const errores = {};

    const uf = await Uf.findByPk(id);
    if (!uf) {
        return res.status(404).json({ ok: false, redirect: "/ufs" });
    }

    // Validacions
    if (!codigo || codigo.trim() === "") errores.codigo = "El codi és obligatori";
    if (!nombre || nombre.trim() === "") errores.nombre = "El nom és obligatori";
    if (horas && isNaN(Number(horas))) errores.horas = "Les hores han de ser numèriques";

    // Codi únic (només si s'ha proporcionat i ha canviat)
    if (codigo && codigo.trim() !== "" && codigo !== uf.codigo && !errores.codigo) {
        const existente = await Uf.findOne({ where: { codigo } });
        if (existente) errores.codigo = "El codi ja existeix";
    }

    if (Object.keys(errores).length > 0) {
        return res.status(400).json({ ok: false, errores });
    }
    try {
        await uf.update({
            codigo,
            nombre,
            horas: horas ? Number(horas) : null,
        });

        // missatge d'èxit
        req.session.flash = {
            type: "success",
            title: "UF actualitzada",
            message: "Les dades s'han desat correctament."
        };

        return res.json({
            ok: true,
            redirect: `/ufs/${uf.id}`,
        });
    } catch (error) {
        return res.status(500).json({ ok: false, error: error.message });
    }
};


// POST /ufs
const postCrear = async (req, res) => {
    const { codigo, nombre, horas } = req.body;
    const errores = {};

    // Validacions
    if (!codigo || codigo.trim() === "") errores.codigo = "El codi és obligatori";
    if (!nombre || nombre.trim() === "") errores.nombre = "El nom és obligatori";
    if (horas && isNaN(Number(horas))) errores.horas = "Les hores han de ser numèriques";

    // Codi únic (només si s'ha proporcionat)
    if (codigo && codigo.trim() !== "" && !errores.codigo) {
        const existente = await Uf.findOne({ where: { codigo } });
        if (existente) errores.codigo = "El codi ja existeix";
    }

    if (Object.keys(errores).length > 0) {
        return res.status(400).json({ ok: false, errores });
    }

    try {
        const nuevaUF = await Uf.create({
            codigo,
            nombre,
            horas: horas ? Number(horas) : null,
        });

        return res.json({
            ok: true,
            redirect: `/ufs/${nuevaUF.id}`,
        });
    } catch (error) {
        return res.status(500).json({ ok: false, error: error.message });
    }
};

module.exports = { getAll, getNuevo, getEditar, putActualizar, postCrear };
