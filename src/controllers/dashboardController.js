const { Alumno, Curso, Anotacion } = require("../models");
const { handleControllerError } = require("../middlewares/errorHandler");

// Pintar el dashboard

const dashboardPrint = async (req, res, next) => {
  try {

    const alumnos = await Alumno.findAll({
      order: [["created_at", "DESC"]],
      limit: 5,
      attributes: ["id", "nombre", "apellidos", "tipo", "created_at"],
    });

    const cursos = await Curso.findAll({
      order: [["created_at", "DESC"]],
      limit: 5,
      attributes: ["id", "codigo_curso","codigo_accion_formativa", "nombre", "fecha_inicio", "fecha_fin"],
    });

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 5;
    const offset = (page - 1) * limit;

    const { count, rows: anotaciones } = await Anotacion.findAndCountAll({
      where: { usuario_id: req.session.usuario.id },
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    // Render 

    res.render("dashboard", {
      titulo: "Inici" /* ¿¿ tauler de control, Pagina principal ?? */,
      usuario: req.session.usuario,
      css: "dashboard.css",
      js: "dashboard.js",
      paginaActual: "dashboard",
      alumnos,
      cursos,
      anotaciones,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        limit,
      },
    });

  } catch (error) {
    return handleControllerError(error, res, next);
  }

};

module.exports = { dashboardPrint };
