require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const { flash } = require("./middlewares/flash.js");
const expressLayouts = require("express-ejs-layouts");
//seeders
const {seedAlumnos,seedCursos} = require("./seeder/seeders.js");

const { ensureDatabaseExists } = require("./config/database");
const { sequelize } = require("./models");

const routes = require("./routes");
const server = express();
const PORT = process.env.PORT || 3000;

// -------------------------------------------------------
// Motor de vistas: EJS + Layout
// -------------------------------------------------------.
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));
server.use(expressLayouts);
server.set("layout", "layout");

// -------------------------------------------------------
// Middleware
// -------------------------------------------------------
server.use(express.static(path.join(__dirname, "public")));
server.use(express.json());
server.use(express.urlencoded({ extended: true })); // para leer formularios

// -------------------------------------------------------
// Sesiones
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
// Mensajes flash
// -------------------------------------------------------

server.use(flash);

// -------------------------------------------------------
// Rutas
// -------------------------------------------------------

server.use("/", routes);
server.use((req, res) => {
  res.status(404).render("404", {
    titulo: "Pàgina no trobada",
    usuario: req.session.usuario,
    css: "404.css",
    js: "404.js"
  });
});

// -------------------------------------------------------
// HANDLER DE ERRORES
// -------------------------------------------------------
server.use((err, req, res, next) => {
  console.error(err);
  if (req.xhr || req.headers.accept?.includes("application/json")) {
    return res.status(500).json({ error: "Error del servidor" });
  }
  res.status(500).render("500", {
    titulo: "Error del servidor",
    usuario: req.session?.usuario,
    css: "500.css",
    js: "500.js"
  });
});

// -------------------------------------------------------
// Arrancar
// -------------------------------------------------------
async function startServer() {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log("Conexión a MySQL OK.");

    await sequelize.sync();
    console.log("Modelos sincronizados.");
    await seedAlumnos();
    await seedCursos();
    server.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar:", error.message);
    process.exit(1);
  }
}

startServer();
