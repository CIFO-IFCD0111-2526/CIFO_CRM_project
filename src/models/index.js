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
const Anotacion = require("./Anotacion");
const Comentario = require("./Comentario");
const Documento = require("./Documento");



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
  },
  apte: {
    type: DataTypes.BOOLEAN,
    allowNull: true           // null = encara no avaluat
  },
  fecha_baixa: {
    type: DataTypes.DATE,
    allowNull: true           // null = sense baixa
  }
}, {
  tableName: 'curso_alumno',  // És el nom a la base de dades SQL ( string ) 
});

/////////////////////////////////////////////////////////////////////TABLAS INTERMEDIAS ¿ A MOVER ?


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

// Comentario

Alumno.hasMany(Comentario, {
    foreignKey: "alumno_id",
    onDelete: "CASCADE",
});

Comentario.belongsTo(Alumno, {
    foreignKey: "alumno_id",
});

Usuario.hasMany(Comentario, {
    foreignKey: "usuario_id",
    onDelete: "CASCADE",
});

Comentario.belongsTo(Usuario, {
    foreignKey: "usuario_id",
});

// Documento

Documento.belongsTo(Usuario, {
  foreignKey: "usuario_id",
});

Usuario.hasMany(Documento, {
  foreignKey: "usuario_id",
});

const db = {
  // taules SQL per nom JS ( objeto JS )
  sequelize,
  Usuario,
  Curso,
  Profesor,
  Alumno,
  Anotacion,
  Comentario,
  Documento,

  // tablas intermedias ( objeto JS )
  CursoAlumno,
};

module.exports = db;
