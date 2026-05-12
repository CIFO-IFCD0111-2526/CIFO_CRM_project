const { Alumno, Curso } = require("../models");
const { handleControllerError } = require("../middlewares/errorHandler");

// Pintar el dashboard

const dashboardPrint = async (req, res, next) => {
  try {
    const alumnos = await Alumno.findAll({
      order: [["created_at", "DESC"]],
      limit: 5,
      attrinutes: ["id", "nombre", "apellidos", "tipo", "created_at"],
    });

    const cursos = await Curso.findAll({
      order: [["created_at", "DESC"]],
      limit: 5,
      attributes: ["id", "codigo", "nombre", "fecha_inicio","fecha_fin"],
    });

    res.render("dashboard", {
      titulo: "Inici" /* ¿¿ tauler de control, Pagina principal ?? */,
      usuario: req.session.usuario,
      css: "dashboard.css",
      js: "dashboard.js",
      paginaActual: "dashboard",
      alumnos,
      cursos,
    });
  } catch (error) {
    handleControllerError(error, req, next);
  }

};

module.exports = { dashboardPrint };
