require("dotenv").config();

const express = require("express");
const { ensureDatabaseExists } = require("./config/database");
const { sequelize } = require("./models");
const apiRoutes = require("./routes");

const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json());

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

    // 4. Levantar servidor
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
