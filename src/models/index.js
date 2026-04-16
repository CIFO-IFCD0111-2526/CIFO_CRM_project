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
<<<<<<< feat/model-profesor
const Profesor = require("./Profesor");
=======
const Alumno = require("./Alumno");
>>>>>>> develop

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
<<<<<<< feat/model-profesor
  Profesor,
=======
  Alumno,
>>>>>>> develop
};

module.exports = db;
