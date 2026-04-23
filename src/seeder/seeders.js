const Alumno = require("../models/Alumno.js");


async function seedAlumnos() {
  try {

    const total = await Alumno.count();

    if (total > 0) {
      console.log("Los alumnos ya existen. Seed cancelado.");
      return;
    }

    console.log("Insertando alumnos de prueba...");

    const alumnos = [
      {
        nombre: "Carlos",
        apellidos: "García López",
        dni: "11111111A",
        telefono: "600111111",
        email: "carlos@test.com",
        nivel_estudios: "ESO",
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
        nivel_estudios: "Bachillerato",
        tipo: "futuro",
      },
      {
        nombre: "David",
        apellidos: "Ruiz Sánchez",
        dni: "33333333C",
        telefono: "600333333",
        email: "david@test.com",
        nivel_estudios: "FP",
        tipo: "actual",
      },
      {
        nombre: "Ana",
        apellidos: "Fernández Torres",
        dni: "44444444D",
        telefono: "600444444",
        email: "ana@test.com",
        nivel_estudios: "Universidad",
        tipo: "antiguo",
      },
      {
        nombre: "Mario",
        apellidos: "López Díaz",
        dni: "55555555E",
        telefono: "600555555",
        email: "mario@test.com",
        nivel_estudios: "ESO",
        tipo: "actual",
      },
      {
        nombre: "Sara",
        apellidos: "Navarro Ruiz",
        dni: "66666666F",
        telefono: "600666666",
        email: "sara@test.com",
        nivel_estudios: "FP",
        tipo: "futuro",
      },
      {
        nombre: "Javier",
        apellidos: "Morales Castro",
        dni: "77777777G",
        telefono: "600777777",
        email: "javier@test.com",
        nivel_estudios: "ESO",
        tipo: "actual",
      },
      {
        nombre: "Lucía",
        apellidos: "Ortega Vega",
        dni: "88888888H",
        telefono: "600888888",
        email: "lucia@test.com",
        nivel_estudios: "Bachillerato",
        tipo: "actual",
      },
      {
        nombre: "Pablo",
        apellidos: "Santos Romero",
        dni: "99999999I",
        telefono: "600999999",
        email: "pablo@test.com",
        nivel_estudios: "FP",
        tipo: "antiguo",
      },
      {
        nombre: "Elena",
        apellidos: "Gil Medina",
        dni: "10101010J",
        telefono: "600101010",
        email: "elena@test.com",
        nivel_estudios: "Universidad",
        tipo: "actual",
      }
    ];

    await Alumno.bulkCreate(alumnos);

    console.log("10 alumnos insertados correctamente");

  } catch (error) {
    console.error("Error insertando alumnos:", error.message);
  }
}

module.exports = seedAlumnos;