const { ValidationError, UniqueConstraintError } = require("sequelize");

function handleControllerError(error, res, fallbackMessage = "Error del servidor.") {
  if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
    const errores = {};
    error.errors?.forEach((e) => {
      errores[e.path] = e.message;
    });
    return res.status(400).json({ ok: false, errores });
  }
  console.error(error);
  return res.status(500).json({ ok: false, error: fallbackMessage });
}

module.exports = { handleControllerError };