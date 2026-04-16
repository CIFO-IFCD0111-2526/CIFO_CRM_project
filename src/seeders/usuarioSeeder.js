// -------------------------------------------------------
// Seeder: crea un usuario admin si la tabla está vacía
// -------------------------------------------------------
// Se ejecuta al arrancar el servidor.
// Solo crea el usuario si no existe ninguno en la tabla.

const bcrypt = require("bcrypt");
const { Usuario } = require("../models");

async function seedUsuarios() {
  const count = await Usuario.count();
  if (count > 0) return; // ya hay usuarios, no hacer nada

  // bcrypt.hash(password, saltRounds)
  // saltRounds = 10 → cuántas vueltas de encriptación (10 es lo estándar)
  const hash = await bcrypt.hash("admin123", 10);

  await Usuario.create({
    nombre: "Admin",
    apellidos: "CIFO",
    email: "admin@cifo.com",
    password: hash,
    nivel_acceso: "admin",
    activo: true,
  });

  console.log("Seed: usuario admin creado → admin@cifo.com / admin123");
}

module.exports = seedUsuarios;
