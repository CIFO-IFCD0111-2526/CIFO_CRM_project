const { Usuario } = require("..\models\Usuario.js");
const bcrypt = require("bcrypt");

// GET /login

const loginForm = async (req, res) => {
  // Se redirecciona a dashboard en caso de que el usuario esté logeado
  if (req.session && req.session.usuario) {
    return res.redirect("/dashboard");
  }
  // Se renderiza el ejs de login en caso de que no
  res.render("login", {
    titulo: "Login",
    usuario: null,
  });
};

// POST /login

const login = async (req, res) => {
    const { loginEmail, loginPassword } = req.body;

    try {
        // Buscamos si existe el usuario en la tabla 'usuario' de la DB, y recogemos solamente su email y contraseña.
        const userLogin = Usuario.findOne({ where: { email : loginEmail, activo : true } })({
            attributes: ['password'],
        });
        // Si no existe el usuario 
        if (userLogin === null) {
            res.status(400).json({ error: "El usuario no existe." });
        } else if (!bcrypt.compareSync(loginPassword, userLogin.password)) {
            res.status(400).json({ error: "Contraseña incorrecta." });
        } else if (userLogin.activo === false) {
            res.status(400).json({ error: "Usuario inactivo." });
        };

        // Creamos la cookie de sesión en el req
        req.session.usuario = {
            id: userLogin.id,
            nombre: userLogin.nombre,
            apellidos: userLogin.apellidos,
            email: userLogin.email,
            nivel_acceso: userLogin.nivel_acceso,
        };

        // Respuesta OK

        return res.json(200)({ ok: true, redirect: "/dashboard" });

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