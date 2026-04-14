const { Router } = require("express");
const usuarioRoutes = require("./usuarioRoutes");

const router = Router();

// -------------------------------------------------------
// Registro central de rutas
// -------------------------------------------------------
// Para añadir nuevas rutas:
//   1. Crea el archivo en /routes (ej: alumnoRoutes.js)
//   2. Impórtalo aquí
//   3. Monta con router.use("/ruta", tuRouter)
// -------------------------------------------------------

router.use("/usuarios", usuarioRoutes);

// router.use("/alumnos", alumnoRoutes);
// router.use("/cursos", cursoRoutes);

module.exports = router;
