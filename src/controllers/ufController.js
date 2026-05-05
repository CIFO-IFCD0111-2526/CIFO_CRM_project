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
// GET /ufs/:id

const getById = async (req, res, next) => {
    try {
        const uf = await Uf.findByPk(req.params.id, {
            include: [Curso],
        });

        if (!uf) {
            req.session.flash = {
                type: "error",
                title: "No trobada",
                message: "La UF no existeix.",
            };
            return res.redirect("/ufs");
        }

        res.render("uf-detalle", {
            titulo: "Detall de UF",
            usuario: req.session.usuario,
            css: "ufs.css",
            js: "ufs.js",
            paginaActual: "ufs",
            uf
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
        css: "ufs.css",
        js: "ufs.js",
        paginaActual: "ufs",
        uf: {},
        errores: {},
    });
};

// POST /ufs
const createUf = async (req, res, next) => {
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
        return handleControllerError(error, res, next);
    }
};
//DELETE/ufs/:id
const deleteUf = async (req, res, next) => {
    try {
        const uf = await Uf.findByPk(req.params.id);
        if (!uf) return res.status(404).json({
            ok: false,
            message: "UF no trobada."
        });
        await uf.destroy();
        req.session.flash = {
            type: "success",
            title: "UF eliminada",
            message: "La UF s'ha eliminat correctament.",
        };
        return res.status(200).json({ ok: true, redirect: "/ufs" });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

module.exports = { getAll, getById, renderNewUf, createUf, deleteUf };
