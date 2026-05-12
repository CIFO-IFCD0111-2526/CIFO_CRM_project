// module.exports = {};
const { Anotacion } = require("../models");

const create = async (req, res) => {
  try {
    const { contenido } = req.body;

    if (!contenido || !contenido.trim()) {
      return res.status(400).json({
        ok: false,
        error: "El contingut és obligatori.",
      });
    }

    if (!req.session?.usuario?.id) {
      return res.status(401).json({
        ok: false,
        error: "No autenticado",
      });
    }

    await Anotacion.create({
      usuario_id: req.session.usuario.id,
      contenido: contenido.trim(),
    });

    req.session.flash = {
      type: "success",
      message: "Anotació creada correctament.",
    };

    return res.json({
      ok: true,
      redirect: "/dashboard",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      error: "Error intern del servidor.",
    });
  }
};

module.exports = {
  create,
};
