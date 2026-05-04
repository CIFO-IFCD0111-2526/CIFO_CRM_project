const { ValidationError, UniqueConstraintError } = require("sequelize");

// Errores de validación de Sequelize → 400 con detalle por campo.
// Cualquier otro error se delega a `next` para que el handler global
// (server.js) decida si renderizar 500.ejs o devolver JSON 500.
function handleControllerError(error, res, next) {
  if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
    const errores = {};
    error.errors?.forEach((e) => {
      errores[e.path] = e.message;
    });
    return res.status(400).json({ ok: false, errores });
  }
  return next(error);
}

module.exports = { handleControllerError };
