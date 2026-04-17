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
const Uf = require("./Uf");

// -------------------------------------------------------
// Asociaciones / Relaciones
// -------------------------------------------------------
// TODO: definir relaciones cuando los modelos estén completos
// -------------------------------------------------------


const db = {
  sequelize,
  Usuario,
  Uf,
};

module.exports = db;
