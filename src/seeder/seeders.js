const Alumno = require("../models/Alumno.js");
const Curso = require("../models/Curso.js");
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
      },
      {
        nombre: "Raúl",
        apellidos: "Méndez Flores",
        dni: "12121212K",
        telefono: "600121212",
        email: "raul@test.com",
        nivel_estudios: "3",
        tipo: "actual",
      },
      {
        nombre: "Claudia",
        apellidos: "Herrera León",
        dni: "13131313L",
        telefono: "600131313",
        email: "claudia@test.com",
        nivel_estudios: "5",
        tipo: "futuro",
      },
      {
        nombre: "Iván",
        apellidos: "Peña Rubio",
        dni: "14141414M",
        telefono: "600141414",
        email: "ivan@test.com",
        nivel_estudios: "1",
        tipo: "actual",
      },
      {
        nombre: "Patricia",
        apellidos: "Cano Molina",
        dni: "15151515N",
        telefono: "600151515",
        email: "patricia@test.com",
        nivel_estudios: "6",
        tipo: "antiguo",
      },
      {
        nombre: "Hugo",
        apellidos: "Delgado Serrano",
        dni: "16161616O",
        telefono: "600161616",
        email: "hugo@test.com",
        nivel_estudios: "2",
        tipo: "actual",
      },
      {
        nombre: "Marta",
        apellidos: "Vidal Ramos",
        dni: "17171717P",
        telefono: "600171717",
        email: "marta@test.com",
        nivel_estudios: "4",
        tipo: "futuro",
      },
      {
        nombre: "Diego",
        apellidos: "Iglesias Núñez",
        dni: "18181818Q",
        telefono: "600181818",
        email: "diego@test.com",
        nivel_estudios: "3",
        tipo: "actual",
      },
      {
        nombre: "Nuria",
        apellidos: "Campos Prieto",
        dni: "19191919R",
        telefono: "600191919",
        email: "nuria@test.com",
        nivel_estudios: "5",
        tipo: "actual",
      },
      {
        nombre: "Adrián",
        apellidos: "Reyes Blanco",
        dni: "20202020S",
        telefono: "600202020",
        email: "adrian@test.com",
        nivel_estudios: "1",
        tipo: "antiguo",
      },
      {
        nombre: "Cristina",
        apellidos: "Fuentes Cabrera",
        dni: "21212121T",
        telefono: "600212121",
        email: "cristina@test.com",
        nivel_estudios: "6",
        tipo: "actual",
      }
    ];

    await Alumno.bulkCreate(alumnos);

    console.log("20 alumnes inserits correctament");

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
module.exports = { seedAlumnos, seedCursos, seedProfesores };