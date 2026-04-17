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
})


const AlumnoUf = sequelize.define('alumno_uf', {  
  estat: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // false = pendent, true = aprovada/feta
    allowNull: false
    }
}, {
  tableName: 'alumno_uf',
})

/////////////////////////////////////////////////////////////////////TABLAS INTERMEDIAS ¿ A MOVER ?


// los cursos tienen varias Uf, y las mismas Uf pueden estar en mas de un curso
Curso.belongsToMany(Uf, {through: 'curso_uf' });
Uf.belongsToMany(Curso, {through: 'curso_uf' });

// los profesores pueden estar en varios cursos y algunos cursos pueden tener mas de un profe
Profesor.belongsToMany(Curso, { through: "curso_profesor" });
Curso.belongsToMany(Profesor, { through: "curso_profesor" });

// Cursos tienen varios alumnos, los alumnos pueden estar en varios cursos, 
// ( aunque no en dos cursos activos simultáneamente en teoria , deberemos verificar en otra parte, quizás )
Alumno.belongsToMany(Curso,  { through: CursoAlumno });
Curso.belongsToMany(Alumno,  { through: CursoAlumno });

// las UF estan en varios cursos y los cursos tiene varias Uf
Uf.belongsToMany(Alumno,  { through: AlumnoUf });
Alumno.belongsToMany(Uf,  { through: AlumnoUf });


const db = {
  // taules SQL per nom JS ( objeto JS ) 
  sequelize,
  Usuario,
  Curso,
  Alumno,
  Uf,

  // tablas intermedias ( objeto JS ) 
  CursoAlumno,
  AlumnoUf
};

module.exports = db;
