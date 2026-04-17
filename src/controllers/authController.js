const { Usuario } = require("../models");
const bcrypt = require("bcrypt");

// GET /login

const loginForm = async (req, res) => {
  res.render("login", {
    titulo: "Login",
    usuario: null,
    css: "login.css",
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

//Renderizar formulario de registro con el mismo diseño que el login.
// GET /register 
const registerForm = async (req, res) => {
  res.render("register", {
    titulo: "Registro",
    usuario: null,
    css: "register.css",
  });
};

//Procesar el registro de un nuevo usuario, validando que el email no exista, hasheando la contraseña y guardando el nuevo usuario en la base de datos.
// POST /register
const register = async (req, res) => {
  const { nombre, apellidos, email, password } = req.body;

  // Validación básica
  if (!nombre || !apellidos || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    // Comprobar email único
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ error: "El email ya está registrado." });
    }

    // Hashear password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear usuario
    await Usuario.create({
      nombre,
      apellidos,
      email,
      password: hashedPassword,
      nivel_acceso: "editor",
      activo: true,
    });

    return res.status(200).json({ ok: true, redirect: "/login" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de servidor." });
  }
};


// POST /logout

const logout = async (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true, redirect: "/login" });
  });
};

module.exports = { loginForm, login, registerForm, register, logout };
