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

module.exports = { getAll };
