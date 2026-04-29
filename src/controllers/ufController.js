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
        titulo: "Nueva UF",
        usuario: req.session.usuario,
        css: "uf-form.css",
        js: "uf-form.js",
        uf: {}, // formulario vacío
        errores: {},
    });
};

// POST /ufs
const postCrear = async (req, res) => {
    const { codigo, nombre, horas } = req.body;
    const errores = {};

    // Validaciones
    if (!codigo || codigo.trim() === "") errores.codigo = "El código es obligatorio";
    if (!nombre || nombre.trim() === "") errores.nombre = "El nombre es obligatorio";
    if (horas && isNaN(Number(horas))) errores.horas = "Las horas deben ser numéricas";

    // Código único
    const existente = await Uf.findOne({ where: { codigo } });
    if (existente) errores.codigo = "El código ya existe";

    if (Object.keys(errores).length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const nuevaUF = await Uf.create({ codigo, nombre, horas: horas || 0 });

        return res.json({
            redirect: `/ufs/${nuevaUF.id}`,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { getAll, getNuevo, postCrear };
