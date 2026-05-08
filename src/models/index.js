const { DataTypes } = require("sequelize");
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
const Uf = require("./Uf");
const Anotacion = require("./Anotacion");



// -------------------------------------------------------
// Asociaciones / Relaciones
// -------------------------------------------------------
// TODO: definir relaciones cuando los modelos estén completos
// -------------------------------------------------------

//////////////////////////////////////////////////////////////////////TABLAS INTERMEDIAS ¿ A MOVER ?

// Aquest fa referència a l'objecte JS ( variable )
const CursoAlumno = sequelize.define('curso_alumno', {   // És el nom que fa servir JS  ( string )
  estat: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,      // false = pendent, true = aprovada/feta
    allowNull: false
  }
}, {
  tableName: 'curso_alumno',  // És el nom a la base de dades SQL ( string ) 
});


const AlumnoUf = sequelize.define('alumno_uf', {
  estat: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // false = pendent, true = aprovada/feta
    allowNull: false
  }
}, {
  tableName: 'alumno_uf',
});

const curso_profesor = sequelize.define('curso_profesor', {
  // Aquí iría la definición de columnas extra en caso necesario, si no se ocupa la posición del parámetro con un objeto vacío PETA.
}, {
  tableName: 'curso_profesor',
});

/////////////////////////////////////////////////////////////////////TABLAS INTERMEDIAS ¿ A MOVER ?


// los cursos tienen varias Uf, y las mismas Uf pueden estar en mas de un curso
Curso.belongsToMany(Uf, {
  through: 'curso_uf',
  onDelete: "CASCADE"
});
Uf.belongsToMany(Curso, {
  through: 'curso_uf',
  onDelete: "CASCADE"
});

// los profesores pueden estar en varios cursos y algunos cursos pueden tener mas de un profe
Profesor.belongsToMany(Curso, {
  through: "curso_profesor",
  onDelete: "CASCADE"
});
Curso.belongsToMany(Profesor, {
  through: "curso_profesor",
  onDelete: "CASCADE"
});

// Cursos tienen varios alumnos, los alumnos pueden estar en varios cursos, 
// ( aunque no en dos cursos activos simultáneamente en teoria , deberemos verificar en otra parte, quizás )
Alumno.belongsToMany(Curso, {
  through: CursoAlumno,
  foreignKey: "alumno_id",
  onDelete: "CASCADE",
});
Curso.belongsToMany(Alumno, {
  through: CursoAlumno,
  foreignKey: "curso_id",
  onDelete: "CASCADE",
});

// las UF estan en varios cursos y los cursos tiene varias Uf
Uf.belongsToMany(Alumno, {
  through: AlumnoUf,
  foreignKey: "alumno_id",
  onDelete: "CASCADE",
});
Alumno.belongsToMany(Uf, {
  through: AlumnoUf,
  foreignKey: "uf_id",
  onDelete: "CASCADE"
});

// Alumno belongsTo Usuario (FK ultimo_id_modif)
Alumno.belongsTo(Usuario, { foreignKey: "ultimo_id_modif" });
Usuario.hasMany(Alumno, { foreignKey: "ultimo_id_modif" });

//Anotacion

Usuario.hasMany(Anotacion, {
    foreignKey: "usuario_id",
    onDelete: "CASCADE",
});

Anotacion.belongsTo(Usuario, {
    foreignKey: "usuario_id",
});

const db = {
  // taules SQL per nom JS ( objeto JS )
  sequelize,
  Usuario,
  Curso,
  Profesor,
  Alumno,
  Uf,
  Anotacion,

  // tablas intermedias ( objeto JS )
  CursoAlumno,
  AlumnoUf,
  curso_profesor,
};

module.exports = db;
