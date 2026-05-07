const bcrypt = require("bcrypt");
const db = require("../config/db"); // Assegura't que la ruta a la teva config de DB és correcta

const usuarioController = {
    login(req, res) {
        res.render("login");
    },

    perfil(req, res) {
        // Aquí és on el teu company eventualment passarà les dades de l'usuari
        res.render("perfil", { user: req.session.user });
    },

    // LA TEVA PART:
    async changePassword(req, res) {
        try {
            const { passwordActual, passwordNova } = req.body;
            const usuarioId = req.session.user.id;

            // 1. Anem a buscar l'usuari a la base de dades
            // Nota: El pool de mysql2 sol retornar un array [files, camps]
            const [rows] = await db.query("SELECT * FROM usuarios WHERE id = ?", [usuarioId]);
            const usuari = rows[0];

            if (!usuari) {
                return res.status(404).json({ ok: false, message: "Usuari no trobat" });
            }

            // 2. Comprovar si la contrasenya actual és correcta
            const match = bcrypt.compareSync(passwordActual, usuari.password);
            if (!match) {
                return res.status(400).json({ ok: false, message: "La contrasenya actual no és correcta" });
            }

            // 3. Hashejar la nova contrasenya
            const salt = bcrypt.genSaltSync(10);
            const hashedPw = bcrypt.hashSync(passwordNova, salt);

            // 4. Actualitzar a la base de dades
            await db.query("UPDATE usuarios SET password = ? WHERE id = ?", [hashedPw, usuarioId]);

            // 5. Preparar missatge flash i respondre
            req.session.flash = {
                type: "success",
                msg: "Contrasenya canviada correctament"
            };

            return res.json({ ok: true, redirect: "/perfil" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ ok: false, message: "Error intern del servidor" });
        }
    }
};

module.exports = usuarioController;