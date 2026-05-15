const multer = require("multer");
const path = require("path");
const { v4: uuid } = require("uuid");
const { Documento } = require("../models");

const upload = multer({
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuid()}${ext}`);
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadMiddleware = upload.single("archivo");

// Post: /:entidadTipo/:entidadId
const uploadDocument = async (req, res, next) => {
    try {
        const { entidadTipo, entidadId } = req.params;
        const existe = await Documento.findOne({
            where: {
                entidad_tipo: entidadTipo,
                entidad_id: entidadId,
                nombre_original: req.file.originalname,
            },
        });

        if (existe) {
            return res.status(400).json({
                ok: false,
                error: "Aquest document ja existeix per aquesta entitat",
            });
        }
        const documento = await Documento.create({
            entidad_tipo: entidadTipo,
            entidad_id: entidadId,
            nombre_original: req.file.originalname,
            nombre_fichero: req.file.filename,
            mime_type: req.file.mimetype,
            tamano: req.file.size,
            usuario_id: req.session.usuario.id,
        });

        return res.json({
            ok: true,
            documento,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { uploadMiddleware, uploadDocument };