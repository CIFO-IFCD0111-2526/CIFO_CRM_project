const Alumno = require("../models/Alumno.js");
const Curso = require("../models/Curso.js");
const Uf = require("../models/Uf.js");
const Profesor = require("../models/Profesor.js");

async function seedAlumnos() {
  try {

    const total = await Alumno.count();

    if (total > 0) {
      console.log("Els alumnes ja existeixen. Seed cancel·lat.");
      return;
    }

    console.log("Inserint alumnes de prova...");

    const alumnos = [
      {
        nombre: "Carlos",
        apellidos: "García López",
        dni: "11111111A",
        telefono: "600111111",
        email: "carlos@test.com",
        nivel_estudios: "2",
        tipo: "actual",
        derechos_imagen: true,
        cesion_material: false,
      },
      {
        nombre: "Laura",
        apellidos: "Martínez Pérez",
        dni: "22222222B",
        telefono: "600222222",
        email: "laura@test.com",
        nivel_estudios: "5",
        tipo: "futuro",
      },
      {
        nombre: "David",
        apellidos: "Ruiz Sánchez",
        dni: "33333333C",
        telefono: "600333333",
        email: "david@test.com",
        nivel_estudios: "4",
        tipo: "actual",
      },
      {
        nombre: "Ana",
        apellidos: "Fernández Torres",
        dni: "44444444D",
        telefono: "600444444",
        email: "ana@test.com",
        nivel_estudios: "6",
        tipo: "antiguo",
      },
      {
        nombre: "Mario",
        apellidos: "López Díaz",
        dni: "55555555E",
        telefono: "600555555",
        email: "mario@test.com",
        nivel_estudios: "2",
        tipo: "actual",
      },
      {
        nombre: "Sara",
        apellidos: "Navarro Ruiz",
        dni: "66666666F",
        telefono: "600666666",
        email: "sara@test.com",
        nivel_estudios: "4",
        tipo: "futuro",
      },
      {
        nombre: "Javier",
        apellidos: "Morales Castro",
        dni: "77777777G",
        telefono: "600777777",
        email: "javier@test.com",
        nivel_estudios: "2",
        tipo: "actual",
      },
      {
        nombre: "Lucía",
        apellidos: "Ortega Vega",
        dni: "88888888H",
        telefono: "600888888",
        email: "lucia@test.com",
        nivel_estudios: "5",
        tipo: "actual",
      },
      {
        nombre: "Pablo",
        apellidos: "Santos Romero",
        dni: "99999999I",
        telefono: "600999999",
        email: "pablo@test.com",
        nivel_estudios: "4",
        tipo: "antiguo",
      },
      {
        nombre: "Elena",
        apellidos: "Gil Medina",
        dni: "10101010J",
        telefono: "600101010",
        email: "elena@test.com",
        nivel_estudios: "6",
        tipo: "actual",
      }
    ];

    await Alumno.bulkCreate(alumnos);

    console.log("10 alumnes inserits correctament");

  } catch (error) {
    console.error("Error inserint alumnes:", error.message);
  }
}

async function seedCursos() {
  try {

    const total = await Curso.count();

    if (total > 0) {
      console.log("Els cursos ja existeixen. Seed cancel·lat.");
      return;
    }

    console.log("Inserint cursos de prova...");

    const cursos = [
      {
        nombre: "Desenvolupament Web Frontend",
        codigo: "DWFE-2025",
        fecha_inicio: new Date("2025-02-10"),
        fecha_fin: new Date("2025-06-30"),
        requisitos: 2
      },
      {
        nombre: "Desenvolupament Web Backend",
        codigo: "DWBE-2025",
        fecha_inicio: new Date("2025-03-01"),
        fecha_fin: new Date("2025-07-15"),
        requisitos: 4
      },
      {
        nombre: "Introducció a la Programació",
        codigo: "INTRO-PROG",
        fecha_inicio: new Date("2025-01-15"),
        fecha_fin: new Date("2025-04-15"),
        requisitos: 1
      },
      {
        nombre: "Administració de Sistemes Linux",
        codigo: "ASIX-LINUX",
        fecha_inicio: new Date("2025-04-01"),
        fecha_fin: new Date("2025-09-01"),
        requisitos: 4
      },
      {
        nombre: "Bases de Dades SQL",
        codigo: "BBDD-SQL",
        fecha_inicio: new Date("2025-05-05"),
        fecha_fin: new Date("2025-08-20"),
        requisitos: 2
      }
    ];

    await Curso.bulkCreate(cursos);

    console.log("5 cursos inserits correctament");

  } catch (error) {
    console.error("Error inserint cursos:", error.message);
  }
}

async function seedUfs() {
  try {
    const total = await Uf.count();
    if (total > 0) {
      console.log("Les UFs ja existeixen. Seed cancel·lat.");
      return;
    }
    console.log("Inserint UFs de prova...");
    const ufs = [
      { codigo: "UF001", nombre: "HTML i CSS", horas: 40 },
      { codigo: "UF002", nombre: "JavaScript bàsic", horas: 50 },
      { codigo: "UF003", nombre: "JavaScript avançat", horas: 60 },
      { codigo: "UF004", nombre: "Node.js", horas: 60 },
      { codigo: "UF005", nombre: "Express i APIs", horas: 50 },
      { codigo: "UF006", nombre: "Bases de dades SQL", horas: 60 },
      { codigo: "UF007", nombre: "MongoDB", horas: 40 },
      { codigo: "UF008", nombre: "Git i control de versions", horas: 30 },
      { codigo: "UF009", nombre: "Testing i debugging", horas: 30 },
      { codigo: "UF010", nombre: "Seguretat web", horas: 40 },
      { codigo: "UF011", nombre: "React bàsic", horas: 60 },
      { codigo: "UF012", nombre: "React avançat", horas: 60 },
      { codigo: "UF013", nombre: "UX/UI", horas: 30 },
      { codigo: "UF014", nombre: "Deploy i DevOps bàsic", horas: 40 },
      { codigo: "UF015", nombre: "Projecte final", horas: 80 }
    ];
    await Uf.bulkCreate(ufs);
    console.log("15 UFs inserides correctament");
  } catch (error){
    console.error("Error inserint UFs",error.message);
  }
}
async function seedProfesores() { // 2. Nueva función de seed
  try {
    const total = await Profesor.count();

    if (total > 0) {
      console.log("Los profesores ya existen. Seed cancelado.");
      return;
    }

    console.log("Insertando profesores de prueba...");

    const profesores = [
      {
        nombre: "Alan",
        apellidos: "Turing",
        email: "alan.turing@test.com",
      },
      {
        nombre: "Ada",
        apellidos: "Lovelace",
        email: "ada.lovelace@test.com",
      },
      {
        nombre: "Margaret",
        apellidos: "Hamilton",
        email: "m.hamilton@test.com",
      },
      {
        nombre: "Grace",
        apellidos: "Hopper",
        email: "grace.hopper@test.com",
      },
      {
        nombre: "Linus",
        apellidos: "Torvalds",
        email: "linus.t.linux@test.com",
      }
    ];

    await Profesor.bulkCreate(profesores);
    console.log("5 profesores insertados correctamente");

  } catch (error) {
    console.error("Error insertando profesores:", error.message);
  }
}

// 3. Exportar la nueva función
module.exports = { seedAlumnos, seedCursos, seedUfs, seedProfesores };