const { Usuario } = require("../models");
const bcrypt = require("bcrypt");
const { sendMail } = require("../config/mailer.js");

// GET /login

const loginForm = async (req, res) => {
  res.render("login", {
    titulo: "Inici de sessió",
    usuario: null,
    css: "login.css",
    js: "auth.js",
  });
};

//Redirigeix si has oblidat la contrasenya a un formulari.

const forgotPasswordForm = (req, res) => {
  res.render("forgot-password", {
    titulo: "Recuperar contrasenya",
    usuario: null,
    css: "login.css",
    js: "auth.js",
  });
};


// POST /login

const login = async (req, res) => {
  const { loginEmail, loginPassword, loginRemember } = req.body;

  try {
    const userLogin = await Usuario.findOne({
      where: { email: loginEmail, activo: true },
    });

    if (!userLogin) {
      return res.status(400).json({ error: "L'usuari no existeix." });
    }

    if (!bcrypt.compareSync(loginPassword, userLogin.password)) {
      return res.status(400).json({ error: "Contrasenya incorrecta." });
    }

    req.session.usuario = {
      id: userLogin.id,
      nombre: userLogin.nombre,
      apellidos: userLogin.apellidos,
      email: userLogin.email,
      nivel_acceso: userLogin.nivel_acceso,
    };

    if (loginRemember) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    } else {
      req.session.cookie.maxAge = 60 * 60 * 1000;
    }

    return res.status(200).json({ ok: true, redirect: "/dashboard" });

  } catch (error) {
    res.status(500).json({ error: "Error del servidor." });
  }
};

//Renderizar formulario de registro con el mismo diseño que el login.
// GET /register 
const registerForm = async (req, res) => {
  res.render("register", {
    titulo: "Registre",
    usuario: null,
    css: "register.css",
    js: "auth.js"
  });
};

//Procesar el registro de un nuevo usuario, validando que el email no exista, hasheando la contraseña y guardando el nuevo usuario en la base de datos.
// POST /register
const register = async (req, res) => {
  const { nombre, apellidos, email, password } = req.body;

  // Validación básica
  if (!nombre || !apellidos || !email || !password) {
    return res.status(400).json({ error: "Tots els camps són obligatoris." });
  }

  try {
    // Comprobar email único
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ error: "El correu electrònic ja està registrat." });
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
    res.status(500).json({ error: "Error del servidor." });
  }
};


// POST /logout

const logout = async (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true, redirect: "/login" });
  });
};

// Función para generar contraseña aleatoria

function generaContrasenaAleatoria(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}

// POST /forgot-password

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validación básica
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "El correu electrònic és obligatori i ha de ser vàlid." });
  }

  try {
    // Comprobar email único
    const existe = await Usuario.findOne({ where: { email, activo: true } });
    if (existe) {
      const nuevoPassword = generaContrasenaAleatoria();
      // Hashear nueva contraseña
      const hashedNuevoPassword = bcrypt.hashSync(nuevoPassword, 10);

      // Actualizar usuario.password en la base de datos
      await Usuario.update(
        { password: hashedNuevoPassword },
        { where: { email, activo: true } }
      );

      //Llamada a SendMail

      try {
        await sendMail({
          to: email,
          subject: "Recuperació de contrasenya - CIFO CRM",
          html: `
          <h2>Has sol·licitat recuperar la teva contrasenya</h2>
          <p>La teva nova contrasenya temporal és:</p>
          <h3> ${nuevoPassword}</h3>
          <p>Et recomanem canviar-la després d'iniciar sessió.</p>
        `,
        });
      } catch (mailError) {
        console.error("Error enviant el correu de recuperació:", mailError);
      }
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor." });
  }

};

module.exports = { loginForm, login, registerForm, register, logout, forgotPasswordForm, forgotPassword };
