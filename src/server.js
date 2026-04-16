// -------------------------------------------------------
// Server.js — Ejemplo webserver con EJS + Layout + Sesiones
// -------------------------------------------------------

require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");

const { ensureDatabaseExists } = require("./config/database");
const { sequelize, Usuario } = require("./models");
const routes = require("./routes");
const seedUsuarios = require("./seeders/usuarioSeeder");

const server = express();
const PORT = process.env.PORT || 3000;

// -------------------------------------------------------
// 1. Motor de vistas: EJS + Layout
// -------------------------------------------------------
// express-ejs-layouts nos permite tener UN layout.ejs
// que se reutiliza en todas las vistas (nav, head, footer).
// Cada vista solo define su contenido, y el layout lo envuelve.

server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));
server.use(expressLayouts);
server.set("layout", "layout"); // usa views/layout.ejs por defecto

// -------------------------------------------------------
// 2. Middleware
// -------------------------------------------------------
server.use(express.static(path.join(__dirname, "public")));
server.use(express.json());
server.use(express.urlencoded({ extended: true })); // para leer formularios

// -------------------------------------------------------
// 3. Sesiones
// -------------------------------------------------------
// express-session guarda datos del usuario en el servidor.
// El navegador solo recibe una cookie con el ID de la sesión.
// Así podemos saber si el usuario ha hecho login o no.

server.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,              // no reguardar si no ha cambiado
  saveUninitialized: false,   // no crear sesión para visitantes anónimos
  cookie: {
    httpOnly: true,           // JS del navegador no puede leer la cookie
    maxAge: 60 * 60 * 1000,  // 1 hora
  },
}));

// -------------------------------------------------------
// 4. Rutas
// -------------------------------------------------------
server.use("/", routes);

// -------------------------------------------------------
// 5. Arrancar
// -------------------------------------------------------
async function startServer() {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log("Conexión a MySQL OK.");

    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados.");

    await seedUsuarios();

    server.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar:", error.message);
    process.exit(1);
  }
}

startServer();
