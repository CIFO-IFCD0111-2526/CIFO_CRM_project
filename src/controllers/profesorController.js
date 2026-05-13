// -------------------------------------------------------
// Controller: Profesores (renderiza vistas)
// -------------------------------------------------------

const { Op, Sequelize } = require("sequelize");
const { Profesor, Curso, curso_profesor } = require("../models");
const { handleControllerError } = require("../middlewares/errorHandler");

/** GET /profesores — listar todos con paginación */
const getAll = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const { count, rows: profesores } = await Profesor.findAndCountAll({
      include: [
        {
          model: Curso,
          attributes: ["nombre"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.render("profesores", {
      titulo: "Professors",
      usuario: req.session.usuario,
      css: "profesores.css",
      js: "profesores.js",
      paginaActual: "profesores",
      profesores,
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

/** GET /profesores/nuevo — formulari alta */
const renderNewProfesor = (req, res) => {
  res.render("profesor-form", {
    titulo: "Nou professor",
    usuario: req.session.usuario,
    css: "profesores.css",
    js: "profesores.js",
    paginaActual: "profesores",
    styles: '<link rel="stylesheet" href="/css/forms.css">',
  });
};

/** POST /profesores — crear professor */
const createProfesor = async (req, res, next) => {
  const { nombre, apellidos, telefono, email } = req.body;

  if (!nombre || !apellidos || !email) {
    return res
      .status(400)
      .json({ ok: false, error: "Nom, cognoms i email són obligatoris." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res
      .status(400)
      .json({ ok: false, error: "Format d'email no vàlid." });
  }

  try {
    const existe = await Profesor.findOne({ where: { email } });
    if (existe) {
      return res
        .status(400)
        .json({
          ok: false,
          error: "Ja existeix un professor amb aquest email.",
        });
    }

    const profesor = await Profesor.create({
      nombre,
      apellidos,
      telefono: telefono || null,
      email,
    });

    req.session.flash = {
      type: "success",
      title: "Professor creat",
      message: `El professor ${profesor.nombre} ${profesor.apellidos} s'ha creat correctament.`,
    };

    return res
      .status(201)
      .json({ ok: true, redirect: `/profesores/${profesor.id}` });
  } catch (error) {
    return handleControllerError(error, res, next);
  }
};

/** GET /profesores/:id — detall professor */
const getById = (req, res) => {
  const profesor = req.profesor;
  res.render("profesor-detalle", {
    titulo: `${profesor.nombre} ${profesor.apellidos}`,
    usuario: req.session.usuario,
    css: "profesores.css",
    js: "profesores.js",
    paginaActual: "profesores",
    profesor,
  });
};

const getEditForm = (req, res) => {
  const profesor = req.profesor;
  res.render("profesor-form", {
    titulo: `Editar ${profesor.nombre} ${profesor.apellidos}`,
    usuario: req.session.usuario,
    css: "profesores.css",
    js: "profesores.js",
    styles: '<link rel="stylesheet" href="/css/forms.css">',
    paginaActual: "profesores",
    profesor,
  });
};

/** PUT /profesores/:id — editar professor */
const updateProfesor = async (req, res, next) => {
  try {
    const profesor = req.profesor;
    const { nombre, apellidos, telefono, email } = req.body;

    if (!nombre || !apellidos || !email) {
      return res
        .status(400)
        .json({ ok: false, error: "Nom, cognoms i email són obligatoris." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ ok: false, error: "Format d'email no vàlid." });
    }
    if (email !== profesor.email) {
      const existe = await Profesor.findOne({ where: { email } });
      if (existe) {
        return res
          .status(400)
          .json({
            ok: false,
            error: "Ja existeix un professor amb aquest email.",
          });
      }
    }
    await profesor.update({
      nombre,
      apellidos,
      telefono: telefono || null,
      email,
    });

    req.session.flash = {
      type: "success",
      title: "Professor actualitzat",
      message: `El professor ${profesor.nombre} ${profesor.apellidos} s'ha actualitzat correctament.`,
    };
    return res.json({ ok: true, redirect: `/profesores/${profesor.id}` });
  } catch (error) {
    return handleControllerError(error, res, next);
  }
};

/** DELETE /profesores/:id — eliminar professor */
const deleteProfesor = async (req, res, next) => {
  try {
    const profesor = req.profesor;
    await profesor.destroy();

    req.session.flash = {
      type: "success",
      title: "Professor eliminat",
      message: `El professor ${profesor.nombre} ${profesor.apellidos} s'ha eliminat correctament.`,
      keepModal: true,
    };

    return res.json({
      ok: true,
      redirect: "/profesores",
    });
  } catch (error) {
    return handleControllerError(error, res, next);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const searchProfesor = async (req, res, next) => {
  const q = (req.query.q || "").trim();

  // Si hi ha menys de 2 caràcters → retornem array buit
  if (q.length < 2) {
    return res.json([]);
  }

  // Construïm el filtre de cerca
  const where = {
    [Op.or]: [
      { nombre: { [Op.like]: `%${q}%` } },
      { apellidos: { [Op.like]: `%${q}%` } },
      { email: { [Op.like]: `%${q}%` } },
    ],
  };

  try {
    const profesores = await Profesor.findAll({
      where,
      limit: 10,
      order: [["apellidos", "ASC"]],
      attributes: ["id", "nombre", "apellidos", "email"],
    });

    return res.json(profesores);
  } catch (error) {
    return handleControllerError(error, res, next);
  }
};

const getAvailable = async (req, res, next) => {
  /*
  retorna 400 + ok: false 
quan és array buida
o array de busqueda ( q= ) inferior a 2 char

200 OK quan retorna alguna cosa */

  const q = (req.query.q || "").trim();

  if (q.length < 3 || !req.query.cursoId || !q) {
    return res.status(400).json({ ok: false });
  } else {
    // faltaria asignar un camp als profes per mirar si estan disponibles o no
    // i que tampoc els mostrés ( pero no estava a la issue )
    try {
      // const cursoId = req.query.cursoId || "";  // modificado para evitar SQL injection,
      // la declaracio ha destar DINS el TRY !!!
      const cursoId = Number(req.query.cursoId);
      if (!Number.isInteger(cursoId)) {
        throw new Error("Invalid cursoId, ha de ser un valor numèric");
      }
      const profWhere = {
        [Op.and]: [
          // profesores QUE una de dos ( and )
          {
            // A) cumpleixin ALGUNA o ( OR ) més de les condiciones  ( or )
            [Op.or]: [
              { nombre: { [Op.like]: `%${q}%` } }, // o el nombre contiene q ( cadena a buscar )
              { apellidos: { [Op.like]: `%${q}%` } }, // o el apellidos contiene q ( cadena a buscar )
              { telefono: { [Op.like]: `%${q}%` } }, // o el telefono contiene q ( cadena a buscar )
              { email: { [Op.like]: `%${q}%` } }, // o el email contiene q ( cadena a buscar )
            ],
          },
          // Y  que  B)   (  que  ve per l' "and" de dalt )
          {
            id: {
              // (id del profe) NO  estingui  asignats a aquest cursoId a la taula CursoProfe .
              [Op.notIn]: Sequelize.literal(
                // el mètode literal no gestiona SQL injection !!!!
                `(SELECT profesor_id FROM curso_profesor WHERE curso_id = ${cursoId})`,
              ),
            },
          },
        ],
      };
      const profesores = await Profesor.findAll({
        where: profWhere,
        limit: 10,
        order: [["apellidos", "ASC"]],
        attributes: ["id", "nombre", "apellidos", "telefono", "email"],
      });
      if (profesores.length == 0) {
        return res.status(400).json({ profesores, ok: false });
      } else {
        return res.json(profesores);
      }
    } catch (error) {
      return handleControllerError(error, res, next);
    }
  }
};

module.exports = {
  getAll,
  renderNewProfesor,
  createProfesor,
  getById,
  getEditForm,
  updateProfesor,
  deleteProfesor,
  searchProfesor,
  getAvailable,
};
