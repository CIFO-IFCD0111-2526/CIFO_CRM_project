// -------------------------------------------------------
// Controller: Profesores (renderiza vistas)
// -------------------------------------------------------

const { Profesor, Curso } = require("../models");

/** GET /profesores — listar todos */
const getAll = async (req, res) => {
    try {
        const profesores = await Profesor.findAll({
            attributes: { exclude: ["password"] },
            include: [{
                model: Curso,
                attributes: ["nombre"]
            }],
            order: [["id", "ASC"]],
        });

        res.render("profesores", {
            titulo: "Profesores",
            usuario: req.session.usuario,
            profesores,
        });
    } catch (error) {
        res.status(500).send("Error al cargar profesores: " + error.message);
    }
};

module.exports = { getAll };