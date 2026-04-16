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
const Curso = require("./Curso");

Curso.belongsToMany(Uf, {through: 'curso_uf' });
Uf.belongsToMany(Curso, {through: 'curso_uf' });

const Profesor = require("./Profesor");
const Alumno = require("./Alumno");

// -------------------------------------------------------
// Asociaciones / Relaciones
// -------------------------------------------------------
// TODO: definir relaciones cuando los modelos estén completos
// -------------------------------------------------------
Profesor.belongsToMany(Curso, { through: "curso_profesor" });
Curso.belongsToMany(Profesor, { through: "curso_profesor" });

const db = {
  sequelize,
  Usuario,
  Curso,
  Profesor,
  Alumno,
};

module.exports = db;
