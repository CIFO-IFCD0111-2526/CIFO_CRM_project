const multer = require("multer");
const path = require("path");
const { v4: uuid } = require("uuid");
const { Documento, Alumno, Curso, Profesor } = require("../models");
const fs = require("fs");

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

const uploadMiddleware = (req, res, next) => {
    upload.single("archivo")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            const error = err.code === "LIMIT_FILE_SIZE"
                ? "El fitxer supera el límit de 10MB"
                : `Error pujant fitxer: ${err.message}`;
            return res.status(400).json({ ok: false, error });
        }
        if (err) return res.status(400).json({ ok: false, error: err.message });
        next();
    });
};

const MODELOS_ENTIDAD = { Alumno, Curso, Profesor };

// Post: /:entidadTipo/:entidadId
const uploadDocument = async (req, res, next) => {
    try {
        const { entidadTipo, entidadId } = req.params;

        const Modelo = MODELOS_ENTIDAD[entidadTipo];
        const entidad = await Modelo.findByPk(entidadId);
        if (!entidad) {
            return res.status(404).json({
                ok: false,
                error: "L'entitat no existeix",
            });
        }

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
// GET /documentos/:entidadTipo/:entidadId
const getDocuments = async (req, res, next) => {
    try {
        const { entidadTipo, entidadId } = req.params;

        if (!["Alumno", "Curso", "Profesor"].includes(entidadTipo)) {
            return res.status(400).json({
                ok: false,
                error: "Tipus d'entitat invàlid",
            });
        }

        const documentos = await Documento.findAll({
            where: {
                entidad_tipo: entidadTipo,
                entidad_id: entidadId,
            },
            order: [["createdAt", "DESC"]],
        });

        return res.json({
            ok: true,
            documentos,
        });

    } catch (error) {
        next(error);
    }
};

//GET /documentos/:entidadTipo/:entidadId/:id/descarregar
const downloadDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const documento = await Documento.findByPk(id);
        if (!documento) {
            return res.status(404).json({
                ok: false,
                error: "Document no trobat",
            });
        }
        const filePath = path.join(
            __dirname,
            "../../uploads",
            documento.nombre_fichero
        );
        return res.download(
            filePath,
            documento.nombre_original
        );
    } catch (error) {
        next(error);
    }
};

//DELETE /documentos/:id
const deleteDocument = async (req, res, next) => {
    try {
        const { id } = req.params;

        const documento = await Documento.findByPk(id);

        if (!documento) {
            return res.status(404).json({
                ok: false,
                error: "Document no trobat",
            });
        }

        const filePath = path.join(
            __dirname,
            "../../uploads",
            documento.nombre_fichero
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await documento.destroy();

        return res.json({
            ok: true,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { uploadMiddleware, uploadDocument, getDocuments, downloadDocument, deleteDocument };