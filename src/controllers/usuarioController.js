// -------------------------------------------------------
// Controller: Usuarios (renderiza vistas)
// -------------------------------------------------------

const { Usuario } = require("../models");

/** GET /usuarios — listar todos */
const getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["password"] },
      order: [["id", "ASC"]],
    });
    res.render("usuarios", {
      titulo: "Usuarios",
      usuario: req.session.usuario,
      usuarios,
    });
  } catch (error) {
    res.status(500).send("Error al cargar usuarios: " + error.message);
  }
};

module.exports = { getAll };
