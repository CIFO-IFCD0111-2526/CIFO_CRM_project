const { Usuario } = require("../models");

// -------------------------------------------------------
// CRUD Usuarios
// -------------------------------------------------------

/** GET /api/usuarios */
const getAll = async (_req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["password"] }, // No devolver el password en la respuesta
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** GET /api/usuarios/:id */
const getById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** POST /api/usuarios */
const create = async (req, res) => {
  try {
    const { nombre, apellidos, email, password, nivel_acceso } = req.body;
    const usuario = await Usuario.create({
      nombre,
      apellidos,
      email,
      password,
      nivel_acceso,
    });

    // No devolver el password en la respuesta
    const { password: _, ...data } = usuario.toJSON(); // Desestructuramos para excluir password. password: _, es una convención para indicar que no lo usaremos.
    res.status(201).json(data);
  } catch (error) {
    // Errores de validación de Sequelize
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(500).json({ error: error.message });
  }
};

/** PUT /api/usuarios/:id */
const update = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const { nombre, apellidos, email, nivel_acceso, activo } = req.body;
    await usuario.update({ nombre, apellidos, email, nivel_acceso, activo });

    const { password: _, ...data } = usuario.toJSON();
    res.json(data);
  } catch (error) {
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(500).json({ error: error.message });
  }
};

/** DELETE /api/usuarios/:id */
const remove = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    await usuario.destroy();
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
