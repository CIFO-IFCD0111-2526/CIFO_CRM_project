const { Sequelize } = require("sequelize");

// -------------------------------------------------------
// Conexión a MySQL (XAMPP) con Sequelize
// -------------------------------------------------------
// 1. Primero se conecta SIN base de datos para poder
//    crearla si no existe (CREATE DATABASE IF NOT EXISTS)
// 2. Después se instancia Sequelize apuntando a la BD
// -------------------------------------------------------

const DB_NAME = process.env.DB_NAME || "sequelize_db";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 3306;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  define: {
    // Añade createdAt y updatedAt automáticamente a TODOS los modelos
    timestamps: true,
    // Usa snake_case en las columnas de la BD (created_at, updated_at)
    underscored: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000, // Tiempo máximo en ms que una conexión puede estar inactiva antes de ser liberada
    idle: 10000, // Tiempo máximo en ms que una conexión puede estar inactiva antes de ser cerrada
  },
});

/**
 * Asegura que la base de datos exista antes de sincronizar.
 * Se conecta a MySQL sin especificar BD y ejecuta CREATE DATABASE IF NOT EXISTS.
 */
async function ensureDatabaseExists() {
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await connection.end();

  console.log(`Base de datos "${DB_NAME}" verificada / creada.`);
}

module.exports = { sequelize, ensureDatabaseExists };
