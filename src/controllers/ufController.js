const { Uf, Curso } = require("../models");
const { handleControllerError } = require("../middlewares/errorHandler");

// GET /ufs
const getAll = async (req, res, next) => {
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
        return handleControllerError(error, res, next);
    }
};

// GET /ufs/nuevo
const renderNewUf = (req, res) => {
    res.render("uf-form", {
        titulo: "Nova UF",
        usuario: req.session.usuario,
        paginaActual: "ufs",
        css: "ufs.css",
        js: "ufs.js",
        uf: {},
        errores: {},
    });
};

// POST /ufs
const createUf = async (req, res, next) => {
    const { codigo, nombre, horas } = req.body;
    const errores = {};

    if (!codigo?.trim()) errores.codigo = "El codi és obligatori";
    if (!nombre?.trim()) errores.nombre = "El nom és obligatori";
    if (horas && isNaN(Number(horas))) errores.horas = "Les hores han de ser numèriques";

    if (!errores.codigo) {
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
        return handleControllerError(error, res, next);
    }
};

// GET /ufs/:id
const getById = async (req, res, next) => {
    try {
        const uf = req.resource; // gràcies a loadResource

        res.render("uf-detalle", {
            titulo: "Detall de UF",
            usuario: req.session.usuario,
            paginaActual: "ufs",
            css: "ufs.css",
            js: "ufs.js",
            uf
        });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// GET /ufs/:id/editar
const getEditar = async (req, res) => {
    const uf = req.resource;

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
    const uf = req.resource;
    const { codigo, nombre, horas } = req.body;
    const errores = {};

    if (!codigo?.trim()) errores.codigo = "El codi és obligatori";
    if (!nombre?.trim()) errores.nombre = "El nom és obligatori";
    if (horas && isNaN(Number(horas))) errores.horas = "Les hores han de ser numèriques";

    if (codigo !== uf.codigo && !errores.codigo) {
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

// DELETE /ufs/:id
const deleteUf = async (req, res, next) => {
    try {
        const uf = req.resource;
        await uf.destroy();

        req.session.flash = {
            type: "success",
            title: "UF eliminada",
            message: "La UF s'ha eliminat correctament.",
        };

        return res.json({ ok: true, redirect: "/ufs" });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

module.exports = {
    getAll,
    renderNewUf,
    createUf,
    getById,
    getEditar,
    putActualizar,
    deleteUf
};
