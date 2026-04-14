require("dotenv").config();

const path = require("path");
const express = require("express");
const { ensureDatabaseExists } = require("./config/database");
const { sequelize, Usuario } = require("./models");
const apiRoutes = require("./routes");
const seedUsuarios = require("./seeders/usuarioSeeder");

const server = express();
const PORT = process.env.PORT || 3000;

// -------------------------------------------------------
// Configurar EJS como motor de vistas
// -------------------------------------------------------
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));

server.use(express.json());

// -------------------------------------------------------
// Ruta webserver: renderiza HTML con EJS
// -------------------------------------------------------
server.get("/", async (_req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["password"] },
      order: [["id", "ASC"]],
    });
    res.render("usuarios", { usuarios });
  } catch (error) {
    res.status(500).send("Error al cargar usuarios: " + error.message);
  }
});

// -------------------------------------------------------
// Rutas API (JSON)
// -------------------------------------------------------
server.use("/api", apiRoutes);

async function startServer() {
  try {
    // 1. Crear la BD si no existe
    await ensureDatabaseExists();

    // 2. Autenticar conexión con Sequelize
    await sequelize.authenticate();
    console.log("Conexión a MySQL establecida correctamente.");

    // 3. Sincronizar modelos → tablas
    //    alter: true  → actualiza columnas sin borrar datos
    //    force: true  → BORRA y recrea tablas (solo desarrollo)
    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados con la base de datos.");

    // 4. Seed de datos de ejemplo (solo si la tabla está vacía)
    await seedUsuarios();

    // 5. Levantar servidor
    server.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
      console.log(`API disponible en http://localhost:${PORT}/api/usuarios`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error.message);
    process.exit(1); // Salir con error para indicar que el arranque falló
  }
}

startServer();
