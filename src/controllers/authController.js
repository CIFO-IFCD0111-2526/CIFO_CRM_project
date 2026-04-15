const { Usuario } = require("..\models\Usuario.js");
const bcrypt = require("bcrypt");

// Lógica para buscar en DB si el usuario existe y, en caso de que sí, si la contraseña es correcta.
const login = async (req, res) => {
    ({ loginEmail, loginPassword }) = req.body;
    try {
        // Buscamos si existe el usuario en la tabla 'usuario' de la DB, y recogemos solamente su email y contraseña.
        const userLogin = Usuario.findOne(loginEmail)({
            attributes: ['password'],
        });
        if (userLogin === null) {
            res.status(400).json({ error: "El usuario no existe." });
        } else if (!bcrypt.compareSync(loginPassword, userLogin.password)) {
            res.status(400).json({ error: "Contraseña incorrecta." });
        } else {
            res.status(200).json({ message: "Login correcto!" });
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};