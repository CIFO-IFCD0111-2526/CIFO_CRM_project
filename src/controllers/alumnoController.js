const { Op } = require("sequelize");
const { Alumno, Curso } = require("../models");
const { handleControllerError } = require("../middlewares/errorHandler");
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const isCsv = file.mimetype === "text/csv"
            || file.mimetype === "application/vnd.ms-excel"
            || file.originalname.toLowerCase().endsWith(".csv");
        if (!isCsv) return cb(new Error("Només s'accepten arxius CSV"));
        cb(null, true);
    },
});

//GET /alumnos con paginación

const getAll = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
        const offset = (page - 1) * limit;

        const tipo = (req.query.tipo || "").trim().toLowerCase();

        const where = {};

        if (["actual", "antiguo", "futuro"].includes(tipo)) {
            where.tipo = tipo;
        }

        const { count, rows: alumnos } = await Alumno.findAndCountAll({
            where,
            order: [["created_at", "DESC"]],
            limit,
            offset,
        });

        const totalPages = Math.ceil(count / limit);

        res.render("alumnos", {
            titulo: "Mostrar Alumnes",
            usuario: req.session.usuario,
            css: "alumnos.css",
            js: "alumnos.js",
            paginaActual: "alumnos",
            alumnos,
            tipo,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: count,
                limit,
            }
        });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// GET /alumnos/nuevo

const renderNewAlumno = async (req, res) => {
    res.render("alumno-form", {
        titulo: "Nou alumne",
        usuario: req.session.usuario,
        css: "alumnos.css",
        js: "alumnos.js",
        paginaActual: "alumnos",
    });
};

// POST /alumnos

const createAlumno = async (req, res, next) => {
    const { nombre, apellidos, dni, telefono, email, nivel_estudios, tipo, derechos_imagen, cesion_material, accion_difusion } = req.body;

    if (!nombre || !apellidos || !dni || !tipo) {
        return res.status(400).json({ error: "Tots els camps són obligatoris." });
    }

    try {
        const existe = await Alumno.findOne({ where: { dni } });
        if (existe) {
            return res.status(400).json({ error: "L'alumne ja està registrat." });
        }

        const nuevoAlumno = await Alumno.create({
            nombre,
            apellidos,
            dni,
            telefono: telefono || null,
            email: email || null,
            nivel_estudios: nivel_estudios || null,
            tipo,
            derechos_imagen: derechos_imagen === "true" || derechos_imagen === true,
            cesion_material: cesion_material === "true" || cesion_material === true,
            accion_difusion: accion_difusion === "true" || accion_difusion === true,
            ultimo_id_modif: req.session.usuario.id,
        });

        req.session.flash = {
            type: "success",
            title: "Alumne creat",
            message: `L'alumne ${nuevoAlumno.nombre} ${nuevoAlumno.apellidos} s'ha creat correctament.`,
        };

        return res.status(200).json({ ok: true, redirect: "/alumnos" });

    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// GET /alumnos/:id

const getById = (req, res) => {
    res.render("alumno-detalle", {
        titulo: "Busqueda d'alumne per ID",
        usuario: req.session.usuario,
        css: "alumnos.css",
        js: ["alumnos.js", "documento.js"],
        paginaActual: "alumnos",
        alumno: req.alumno
    });
};

//DELETE/alumnos/:id
const deleteAlumno = async (req, res, next) => {
    try {
        const alumno = req.alumno;
        await alumno.destroy();

        req.session.flash = {
            type: "success",
            title: "Alumne eliminat",
            message: `L'alumne: ${alumno.nombre} ${alumno.apellidos} s'ha eliminat correctament.`,
            keepModal: true,
        };

        return res.json({ ok: true, redirect: "/alumnos" });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

const searchAlumno = async (req, res, next) => {
    const q = (req.query.q || "").trim();
    const tipo = (req.query.tipo || "").trim().toLowerCase();

    // Si hi ha menys de 2 caràcters → retornem array buit
    if (q.length < 2) {
        return res.json([]);
    }
    // Filtres per tipus d'alumne
    const tiposValidos = ["actual", "antiguo", "futuro"];

    // Construïm el filtre de cerca
    const where = {
        [Op.or]: [
            { nombre: { [Op.like]: `%${q}%` } },
            { apellidos: { [Op.like]: `%${q}%` } },
            { dni: { [Op.like]: `%${q}%` } }
        ]
    };

    // Si el tipus és vàlid, l'afegim al filtre
    if (tiposValidos.includes(tipo)) {
        where.tipo = tipo;

        console.log("TIPO RECIBIDO:", tipo);
        console.log("WHERE:", where);
    }
    try {
        const alumnos = await Alumno.findAll({
            where,
            limit: 10,
            order: [["apellidos", "ASC"]],
            attributes: ["id", "nombre", "apellidos", "dni", "tipo"]
        });

        return res.json(alumnos);

    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// GET /alumnos/export.csv

const exportCsv = async (req, res, next) => {
    try {
        const alumnos = await Alumno.findAll({
            order: [["created_at", "DESC"]],
        });

        const rows = alumnos.map((alumno) => [
            escapeCsvValue(alumno.nombre),
            escapeCsvValue(alumno.apellidos),
            escapeCsvValue(alumno.dni),
            escapeCsvValue(alumno.telefono),
            escapeCsvValue(alumno.email),
            escapeCsvValue(alumno.nivel_estudios),
            escapeCsvValue(alumno.tipo),
            escapeCsvValue(alumno.derechos_imagen),
            escapeCsvValue(alumno.cesion_material),
            escapeCsvValue(alumno.accion_difusion),
        ].join(","));

        const csv = [
            CSV_HEADERS.join(","),
            ...rows,
        ].join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="alumnos.csv"'
        );

        return res.send(csv);

    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// POST /alumnos/import.csv

const importCsv = async (req, res, next) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                ok: false,
                error: "No s'ha pujat cap arxiu",
            });
        }

        const content = req.file.buffer.toString("utf-8");

        const lines = content
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean);

        if (lines.length < 2) {
            return res.status(400).json({
                ok: false,
                error: "CSV buit",
            });
        }

        const headers = parseCsvLine(lines[0]);

        const headersValid =
            JSON.stringify(headers) === JSON.stringify(CSV_HEADERS);

        if (!headersValid) {
            return res.status(400).json({
                ok: false,
                error: "El header del CSV no és correcte",
            });
        }

        let creados = 0;
        const errores = [];

        const existentes = await Alumno.findAll({ attributes: ["dni"] });
        const dnisExistentes = new Set(existentes.map(a => a.dni));

        for (let i = 1; i < lines.length; i++) {

            try {

                const values = parseCsvLine(lines[i]);

                const alumnoData = {};

                CSV_HEADERS.forEach((header, index) => {
                    alumnoData[header] = values[index] || "";
                });

                const result = await createAlumnoFromCsv(
                    alumnoData,
                    req.session.usuario.id,
                    dnisExistentes
                );

                if (result.error) {
                    errores.push({
                        fila: i + 1,
                        error: result.error,
                    });
                    continue;
                }

                dnisExistentes.add(result.alumno.dni);
                creados++;

            } catch (err) {

                const mensaje = err.errors?.[0]?.message || err.message;
                errores.push({
                    fila: i + 1,
                    error: mensaje,
                });
            }
        }

        return res.json({
            ok: true,
            creados,
            errores,
        });

    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

//PUT /alumnos/:id

const updateAlumno = async (req, res, next) => {
    try {
        const alumno = req.alumno;

        const {
            nombre, apellidos, dni, telefono, email,
            nivel_estudios, tipo, derechos_imagen, cesion_material, accion_difusion
        } = req.body;

        if (!nombre || !apellidos || !dni || !tipo) {
            return res.status(400).json({ ok: false, mensaje: "Tots el camps són obligatoris" });
        }

        if (dni !== alumno.dni) {
            const existe = await Alumno.findOne({ where: { dni } });
            if (existe) {
                return res.status(400).json({ ok: false, error: "Ja existeix un altre alumne amb aquest DNI" });
            }
        }

        await alumno.update({
            nombre,
            apellidos,
            dni,
            telefono: telefono || null,
            email: email || null,
            nivel_estudios: nivel_estudios || null,
            tipo,
            derechos_imagen: derechos_imagen === "true" || derechos_imagen === true,
            cesion_material: cesion_material === "true" || cesion_material === true,
            accion_difusion: accion_difusion === "true" || accion_difusion === true,
            ultimo_id_modif: req.session.usuario.id,
        });

        req.session.flash = {
            type: "success",
            title: "Alumne actualitzat",
            message: "Les dades s'han desat correctament.",
        };

        return res.json({ ok: true, redirect: `/alumnos/${req.params.id}` });

    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

const CSV_HEADERS = [
    "nombre",
    "apellidos",
    "dni",
    "telefono",
    "email",
    "nivel_estudios",
    "tipo",
    "derechos_imagen",
    "cesion_material",
    "accion_difusion",
];

const escapeCsvValue = (value) => {
    if (value === null || value === undefined) return "";

    return `"${String(value).replace(/"/g, '""')}"`;
};

const parseBoolean = (value) => {
    return value === "true" || value === true;
};

const parseCsvLine = (line) => {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const next = line[i + 1];

        if (char === '"') {
            if (inQuotes && next === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === "," && !inQuotes) {
            values.push(current);
            current = "";
        } else {
            current += char;
        }
    }

    values.push(current);

    return values;
};

const createAlumnoFromCsv = async (data, usuarioId, dnisExistentes) => {
    const {
        nombre,
        apellidos,
        dni,
        telefono,
        email,
        nivel_estudios,
        tipo,
        derechos_imagen,
        cesion_material,
        accion_difusion,
    } = data;

    if (!nombre || !apellidos || !dni || !tipo) {
        return { error: "Falten camps obligatoris" };
    }

    if (dnisExistentes.has(dni)) {
        return { error: `Ja existeix un alumne amb DNI ${dni}` };
    }

    const alumno = await Alumno.create({
        nombre,
        apellidos,
        dni,
        telefono: telefono || null,
        email: email || null,
        nivel_estudios: nivel_estudios || null,
        tipo,
        derechos_imagen: parseBoolean(derechos_imagen),
        cesion_material: parseBoolean(cesion_material),
        accion_difusion: parseBoolean(accion_difusion),
        ultimo_id_modif: usuarioId,
    });

    return { alumno };
};

module.exports = { getAll, renderNewAlumno, createAlumno, getById, deleteAlumno, searchAlumno, updateAlumno, exportCsv, importCsv, upload };
