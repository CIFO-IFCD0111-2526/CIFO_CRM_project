// -------------------------------------------------------
// Controller: Auth (Login / Logout)
// -------------------------------------------------------

const bcrypt = require("bcrypt");
const { Usuario } = require("../models");

// GET /login — mostrar formulario
const showLogin = (req, res) => {
  // Si ya tiene sesión, ir al dashboard directamente
  if (req.session && req.session.usuario) {
    return res.redirect("/dashboard");
  }
  res.render("login", {
    titulo: "Login",
    usuario: null, // para que el layout sepa que no hay sesión
  });
};

// POST /login — responde JSON para fetch del cliente
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar usuario por email (y que esté activo)
    const usuario = await Usuario.findOne({ where: { email, activo: true } });

    if (!usuario) {
      return res.status(401).json({ error: "Email o contraseña incorrectos." });
    }

    // 2. Comparar password con el hash de la BD
    const passwordOk = await bcrypt.compare(password, usuario.password);

    if (!passwordOk) {
      return res.status(401).json({ error: "Email o contraseña incorrectos." });
    }

    // 3. Guardar datos en sesión (sin password!)
    req.session.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.email,
      nivel_acceso: usuario.nivel_acceso,
    };

    // 4. Responder OK → el JS del cliente redirige
    res.json({ ok: true, redirect: "/dashboard" });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// POST /logout — destruir sesión, responde JSON
const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true, redirect: "/login" });
  });
};

module.exports = { showLogin, login, logout };
