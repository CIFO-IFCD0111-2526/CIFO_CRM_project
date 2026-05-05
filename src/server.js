require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const { flash }  = require("./middlewares/flash.js");
const expressLayouts = require("express-ejs-layouts");
//seeders
const seeder = require("./seeder/seeders.js");

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
// Sesiones (persistidas en MySQL)
// -------------------------------------------------------
// express-session guarda los datos del usuario en el servidor.
// El navegador solo recibe una cookie con el ID de la sesión.
// MySQLStore persiste las sesiones en la BD, así sobreviven a
// reinicios del proceso Node (sin doble login al reiniciar).

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  createDatabaseTable: true,
});

server.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
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

// -------------------------------------------------------
// 404 - Página no encontrada
// -------------------------------------------------------
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
    console.log("Conexió a MySQL OK.");

    await sequelize.sync();
    console.log("Models sincronizats.");
    await seeder.seedAlumnos();
    await seeder.seedCursos();
    await seeder.seedUfs();
    await seeder.seedProfesores();
    server.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error en iniciar:", error.message);
    process.exit(1);
  }
}

startServer();
