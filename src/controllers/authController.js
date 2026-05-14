const { Usuario } = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendMail } = require("../config/mailer.js");
const { handleControllerError } = require("../middlewares/errorHandler.js");

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

const login = async (req, res, next) => {
  const { loginEmail, loginPassword, loginRemember } = req.body;

  try {
    const userLogin = await Usuario.findOne({
      where: { email: loginEmail },
    });

    if (!userLogin) {
      return res.status(400).json({ error: "L'usuari no existeix." });
    }

    if (!userLogin.activo) {
      return res.status(403).json({
        ok: false,
        error: "El teu compte encara està pendent d'aprovació per un administrador.",
      });
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

    req.session.flash = {
      type: "success",
      title: "Sessió iniciada.",
      message: `Benvingut, ${userLogin.nombre} ${userLogin.apellidos}.`,
    };

    return res.status(200).json({ ok: true, redirect: "/dashboard" });

  } catch (error) {
    return handleControllerError(error, res, next);
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
const register = async (req, res, next) => {
  const { nombre, apellidos, email, password } = req.body;

  // Validación básica
  if (!nombre || !apellidos || !email || !password) {
    return res.status(400).json({ error: "Tots els camps són obligatoris." });
  }

  try {
    // Comprobar email único
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res
        .status(400)
        .json({ error: "El correu electrònic ja està registrat." });
    }

    // Hashear password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear usuario

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellidos,
      email,
      password: hashedPassword,
      nivel_acceso: "editor",
      activo: false,
    });

    const admins = await Usuario.findAll({
      where: {
        nivel_acceso: "admin",
        activo: true,
      },
    });

    for (const admin of admins) {
      try {
        await sendMail({
          to: admin.email,
          subject: "Nou registre pendent d'aprovació",
          html: `
        <h2>Nou registre pendent d'aprovació</h2>
        <p>
          ${nuevoUsuario.nombre} ${nuevoUsuario.apellidos}
          (${nuevoUsuario.email})
        </p>
        <p>
          Accedeix a /usuarios/pendents per aprovar.
        </p>
      `,
        });
      } catch (mailError) {
        console.error("Error enviant correu a admin:", mailError);
      }
    }


    
    return res.status(200).json({
      ok: true,
      message: "Registre rebut. Pendent d'aprovació per admin.",
    });

  } catch (error) {
    return handleControllerError(error, res, next);
  }
};


// POST /logout

const logout = async (req, res) => {
  req.session.regenerate((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error del servidor." });
    }
    req.session.flash = {
      type: "success",
      title: "Sessió tancada",
      message: "Has tancat la sessió correctament.",
    };
    res.json({ ok: true, redirect: "/login" });
  });
};

// Función para generar contraseña aleatoria

function createRandomPassword(length = 12) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    password += characters[randomIndex];
  }
  return password;
}

// POST /forgot-password

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res
      .status(400)
      .json({ error: "El correu electrònic és obligatori i ha de ser vàlid." });
  }

  const respuestaGenerica = {
    ok: true,
    redirect: "/login",
  };

  try {
    const usuario = await Usuario.findOne({ where: { email, activo: true } });

    if (usuario) {
      const nuevoPassword = createRandomPassword();
      const hashedNuevoPassword = bcrypt.hashSync(nuevoPassword, 10);

      await usuario.update({ password: hashedNuevoPassword });

      try {
        await sendMail({
          to: usuario.email,
          subject: "Recuperació de contrasenya - CIFO CRM",
          html: `
            <h2>Has sol·licitat recuperar la teva contrasenya</h2>
            <p>La teva nova contrasenya temporal és:</p>
            <h3>${nuevoPassword}</h3>
            <p>Et recomanem canviar-la després d'iniciar sessió.</p>
          `,
        });
      } catch (mailError) {
        console.error("Error enviant el correu de recuperació:", mailError);
      }
    }

    req.session.flash = {
      type: "success",
      title: "Correu enviat",
      message: "Si l'email està registrat, rebràs un correu amb la nova contrasenya.",
    };

    return res.json(respuestaGenerica);
  } catch (error) {
    return handleControllerError(error, res, next);
  }
};


module.exports = { loginForm, login, registerForm, register, logout, forgotPassword, forgotPasswordForm };