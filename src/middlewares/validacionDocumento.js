const TIPOS_VALIDOS = ["Alumno", "Curso", "Profesor"];

const TIPOS_PERMITIDOS_MIME = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const TAMANO_MAXIMO = 10*1024*1024; // 10 MB

function validateDocument(req, res, next) {
    const { entidadTipo } = req.params;

    //validar entidad
    if (!TIPOS_VALIDOS.includes(entidadTipo)) {
        return res.status(400).json({
            ok: false,
            error: "Tipus d'entitat no vàlid",
        });
    }

    //validar que exista archivo
    if (!req.file) {
        return res.status(400).json({
            ok: false,
            error: "No s'ha pujat cap fitxer",
        });
    }

    //validar MIME
    if (!TIPOS_PERMITIDOS_MIME.includes(req.file.mimetype)) {
        return res.status(400).json({
            ok: false,
            error: "Tipus de fitxer no permès",
        });
    }
     // validar tamaño
    if (req.file.size > TAMANO_MAXIMO) {
        return res.status(400).json({
            ok: false,
            error: "El fitxer supera el límit de 10MB",
        });
    }
    next();
}

module.exports = { validateDocument };