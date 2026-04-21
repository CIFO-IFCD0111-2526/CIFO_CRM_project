// -------------------------------------------------------
// Controller: Profesores (renderiza vistas)
// -------------------------------------------------------

const { Profesor, Curso } = require("../models");

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
            titulo: "Profesores",
            usuario: req.session.usuario,
            profesores,
        });
    } catch (error) {
        res.status(500).send("Error al cargar profesores: " + error.message);
    }
};

module.exports = { listarProfesores };