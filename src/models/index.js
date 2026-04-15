const { sequelize } = require("../config/database");

// -------------------------------------------------------
// Registro central de modelos
// -------------------------------------------------------
// Para añadir un nuevo modelo:
//   1. Crea el archivo en /models (ej: Alumno.js)
//   2. Impórtalo aquí
//   3. Si tiene relaciones, defínelas abajo
// -------------------------------------------------------

const Usuario = require("./Usuario");

// -------------------------------------------------------
// Asociaciones / Relaciones
// -------------------------------------------------------
// Ejemplo para cuando se amplíe:
//
// const Alumno = require("./Alumno");
// const Curso  = require("./Curso");
//
// Alumno.belongsToMany(Curso, { through: "alumno_curso" });
// Curso.belongsToMany(Alumno, { through: "alumno_curso" });
// -------------------------------------------------------

const db = {
  sequelize,
  Usuario,
  // Añadir aquí los nuevos modelos:
  // Alumno,
  // Curso,
  // Profesor,
};

module.exports = db;
