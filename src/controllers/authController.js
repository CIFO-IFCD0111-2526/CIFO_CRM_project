const { Usuario } = require("../models");
const bcrypt = require("bcrypt");

// GET /login

const loginForm = async (req, res) => {
  res.render("login", {
    titulo: "Login",
    usuario: null,
  });
};

// POST /login

const login = async (req, res) => {
  const { loginEmail, loginPassword } = req.body;

  try {
    const userLogin = await Usuario.findOne({
      where: { email: loginEmail, activo: true },
    });

    if (!userLogin) {
      return res.status(400).json({ error: "El usuario no existe." });
    }

    if (!bcrypt.compareSync(loginPassword, userLogin.password)) {
      return res.status(400).json({ error: "Contraseña incorrecta." });
    }

    req.session.usuario = {
      id: userLogin.id,
      nombre: userLogin.nombre,
      apellidos: userLogin.apellidos,
      email: userLogin.email,
      nivel_acceso: userLogin.nivel_acceso,
    };

    return res.status(200).json({ ok: true, redirect: "/dashboard" });

  } catch (error) {
    res.status(500).json({ error: "Error de servidor." });
  }
};

// POST /logout

const logout = async (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true, redirect: "/login" });
  });
};

module.exports = { loginForm, login, logout };
