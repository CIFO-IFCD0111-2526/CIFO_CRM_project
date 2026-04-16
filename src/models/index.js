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


// -------------------------------------------------------
// Asociaciones / Relaciones
// -------------------------------------------------------
// TODO: definir relaciones cuando los modelos estén completos
// -------------------------------------------------------

const db = {
  sequelize,
  Usuario,
  Curso,
};

module.exports = db;
