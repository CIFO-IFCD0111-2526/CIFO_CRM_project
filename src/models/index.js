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

const Profesor = require("./Profesor");
const Alumno = require("./Alumno");

// -------------------------------------------------------
// Asociaciones / Relaciones
// -------------------------------------------------------
// TODO: definir relaciones cuando los modelos estén completos
// -------------------------------------------------------

// los cursos tienen varias Uf, y las Uf pueden estar en mas de un curso
Curso.belongsToMany(Uf, {through: 'curso_uf' });
Uf.belongsToMany(Curso, {through: 'curso_uf' });

//  los profesores pueden estar en varios cursos y algunos cursos pueden tener mas de un profe
Profesor.belongsToMany(Curso, { through: "curso_profesor" });
Curso.belongsToMany(Profesor, { through: "curso_profesor" });

Alumno.belongsToMany(Curso,  { through: "curso_alumno" });
Curso.belongsToMany(Alumno,  { through: "curso_alumno" });



Uf.belongsToMany(Alumno,  { through: "alumno_uf" });
Alumno.belongsToMany(Uf,  { through: "alumno_uf" });
///////////////////////////////////////////////////////////////////////////////////////////////////////////////// AQUI SE LIA XD



const db = {
  sequelize,
  Usuario,
};

module.exports = db;
