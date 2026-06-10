const ExcelJS = require("exceljs");
const { Op } = require("sequelize");
const { Alumno, Curso, CursoAlumno } = require("../models");
const { handleControllerError } = require("../middlewares/errorHandler");
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const name = file.originalname.toLowerCase();
        const valid = name.endsWith(".csv") || name.endsWith(".xlsx") || name.endsWith(".xls");
        if (!valid) return cb(new Error("Només s'accepten arxius CSV o Excel"));
        cb(null, true);
    },
});

// GET /alumnos amb paginació
const getAll = async (req, res, next) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
        const offset = (page - 1) * limit;
        const tipo = (req.query.tipo || "").trim().toLowerCase();
        const where = {};
        if (["actual", "antiguo", "futuro"].includes(tipo)) where.tipo = tipo;

        const { count, rows: alumnos } = await Alumno.findAndCountAll({
            where, order: [["created_at", "DESC"]], limit, offset,
        });

        res.render("alumnos", {
            titulo: "Mostrar Alumnes",
            usuario: req.session.usuario,
            css: "alumnos.css",
            js: "alumnos.js",
            paginaActual: "alumnos",
            alumnos, tipo,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                limit,
            },
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
    const { nombre, apellidos, dni, telefono, email, nivel_estudios, tipo,
            derechos_imagen, cesion_material, accion_difusion } = req.body;

    if (!nombre || !apellidos || !dni || !tipo) {
        return res.status(400).json({ error: "Tots els camps són obligatoris." });
    }

    try {
        const existe = await Alumno.findOne({ where: { dni } });
        if (existe) return res.status(400).json({ error: "L'alumne ja està registrat." });

        const nuevoAlumno = await Alumno.create({
            nombre, apellidos, dni,
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
        alumno: req.alumno,
    });
};

// DELETE /alumnos/:id
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

// GET /alumnos/search
const searchAlumno = async (req, res, next) => {
    const q    = (req.query.q    || "").trim();
    const tipo = (req.query.tipo || "").trim().toLowerCase();
    if (q.length < 2) return res.json([]);

    const where = {
        [Op.or]: [
            { nombre:   { [Op.like]: `%${q}%` } },
            { apellidos:{ [Op.like]: `%${q}%` } },
            { dni:      { [Op.like]: `%${q}%` } },
        ],
    };
    if (["actual", "antiguo", "futuro"].includes(tipo)) where.tipo = tipo;

    try {
        const alumnos = await Alumno.findAll({
            where, limit: 10,
            order: [["apellidos", "ASC"]],
            attributes: ["id", "nombre", "apellidos", "dni", "tipo"],
        });
        return res.json(alumnos);
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// GET /alumnos/export.csv
const exportCsv = async (req, res, next) => {
    try {
        const alumnos = await Alumno.findAll({ order: [["created_at", "DESC"]] });
        const rows = alumnos.map(a =>
            [
                escapeCsvValue(a.nombre),    escapeCsvValue(a.apellidos),
                escapeCsvValue(a.dni),       escapeCsvValue(a.telefono),
                escapeCsvValue(a.email),     escapeCsvValue(a.nivel_estudios),
                escapeCsvValue(a.tipo),      escapeCsvValue(a.derechos_imagen),
                escapeCsvValue(a.cesion_material), escapeCsvValue(a.accion_difusion),
            ].join(",")
        );
        const csv = [CSV_HEADERS.join(","), ...rows].join("\n");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", 'attachment; filename="alumnos.csv"');
        return res.send(csv);
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// POST /alumnos/import.csv
const importCsv = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ ok: false, error: "No s'ha pujat cap arxiu" });
        }

        const rows = await fileToRows(req.file.buffer, req.file.originalname);

        if (rows.length < 2) {
            return res.status(400).json({ ok: false, error: "Arxiu buit" });
        }

        // Validació capçaleres (insensible a accents)
        const headers = rows[0];
        const norm = (s) => String(s).trim().normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "").toUpperCase();

        const headersOk = headers.length === EXCEL_HEADERS.length &&
            EXCEL_HEADERS.every((h, i) => norm(h) === norm(headers[i]));

        if (!headersOk) {
            return res.status(400).json({
                ok: false,
                error: "Les capçaleres no coincideixen amb el format esperat",
            });
        }

        let creados = 0;
        const errores = [];

        const alumnosExistents = await Alumno.findAll({ attributes: ["id", "dni"] });
        const dnisMap = new Map(alumnosExistents.map(a => [a.dni, a.id]));

        const cursosExistents = await Curso.findAll({ attributes: ["id", "codigo_curso"] });
        const cursosMap = new Map(cursosExistents.map(c => [c.codigo_curso, c.id]));

        for (let i = 1; i < rows.length; i++) {
            try {
                const values = rows[i];
                if (values.every(v => !v)) continue;

                // Construïm l'objecte usant les posicions (robust davant accents)
                const row = {};
                EXCEL_HEADERS.forEach((h, idx) => { row[h] = values[idx] || ""; });

                const { curso, alumno, curso_alumno } = parseExcelRow(row);

                if (!alumno.dni || !alumno.nombre || !alumno.apellidos) {
                    errores.push({ fila: i + 1, error: "Falten camps obligatoris: DNI, NOM o COGNOMS" });
                    continue;
                }

                // 1. Curs
                let cursoId = cursosMap.get(curso.codigo_curso);
                if (!cursoId) {
                    const [cursoCreat] = await Curso.findOrCreate({
                        where: { codigo_curso: curso.codigo_curso },
                        defaults: { ...curso, ultimo_id_modif: req.session.usuario.id },
                    });
                    cursoId = cursoCreat.id;
                    cursosMap.set(curso.codigo_curso, cursoId);
                }

                // 2. Alumne
                let alumnoId = dnisMap.get(alumno.dni);
                if (!alumnoId) {
                    const alumnoCreat = await Alumno.create({
                        ...alumno,
                        tipo: "actual",
                        nivel_estudios: null,
                        ultimo_id_modif: req.session.usuario.id,
                    });
                    alumnoId = alumnoCreat.id;
                    dnisMap.set(alumno.dni, alumnoId);
                }

                // 3. Relació curs-alumne
                await CursoAlumno.findOrCreate({
                    where: { alumno_id: alumnoId, curso_id: cursoId },
                    defaults: { ...curso_alumno, ultimo_id_modif: req.session.usuario.id },
                });

                creados++;
            } catch (err) {
                errores.push({ fila: i + 1, error: err.errors?.[0]?.message || err.message });
            }
        }

        return res.json({ ok: true, creados, errores });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
};

// PUT /alumnos/:id
const updateAlumno = async (req, res, next) => {
    try {
        const alumno = req.alumno;
        const { nombre, apellidos, dni, telefono, email, nivel_estudios,
                tipo, derechos_imagen, cesion_material, accion_difusion } = req.body;

        if (!nombre || !apellidos || !dni || !tipo) {
            return res.status(400).json({ ok: false, mensaje: "Tots el camps són obligatoris" });
        }

        if (dni !== alumno.dni) {
            const existe = await Alumno.findOne({ where: { dni } });
            if (existe) return res.status(400).json({ ok: false, error: "Ja existeix un altre alumne amb aquest DNI" });
        }

        await alumno.update({
            nombre, apellidos, dni,
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

// ─── Constants ────────────────────────────────────────────────────────────────

// Capçaleres exportació interna CRM 
const CSV_HEADERS = [
    "nombre", "apellidos", "dni", "telefono", "email",
    "nivel_estudios", "tipo", "derechos_imagen", "cesion_material", "accion_difusion",
];

// Capçaleres del Excel del centre donats com exemple. 

const EXCEL_HEADERS = [
    "CURS", "NUM GIA", "DATA INICI", "DATA FI", "DNI",
    "NOM", "COGNOMS", "CORREU ELECTRONIC", "TELEFON",
    "CESSIO MATERIAL DIDACTIC", "DRETS D'IMATES", "REBRE INFORMACIO",
    "APTE", "BAIXA",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const escapeCsvValue = (value) => {
    if (value === null || value === undefined) return "";
    return `"${String(value).replace(/"/g, '""')}"`;
};

const parseCsvLine = (line) => {
    const values = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const next = line[i + 1];
        if (char === '"') {
            if (inQuotes && next === '"') { current += '"'; i++; }
            else inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
            values.push(current); current = "";
        } else {
            current += char;
        }
    }
    values.push(current);
    return values;
};

// Detecta format i retorna array de files --> troba el format (CSV o Excel) i parseja el contingut a un array de files, on cada fila és un array de valors. 
const fileToRows = async (buffer, filename) => {
    if (/\.(xlsx|xls)$/i.test(filename)) {
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.load(buffer);
        const ws = wb.worksheets[0];
        const rows = [];
        ws.eachRow(row => {
            rows.push(
                row.values.slice(1).map(cell => {
                    if (cell == null) return "";
                    if (typeof cell === "object" && cell.text) return String(cell.text).trim();
                    return String(cell).trim();
                })
            );
        });
        return rows;
    }
    return buffer.toString("utf-8")
        .split(/\r?\n/).map(l => l.trim()).filter(Boolean)
        .map(line => parseCsvLine(line));
};

// DD/MM/YYYY → YYYY-MM-DD -- parser del format europeu al format MySQL, retorna null si no és vàlid o està buit
const dateEuToMysql = (val) => {
    if (!val) return null;
    const [d, m, y] = String(val).split("/");
    return (d && m && y) ? `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}` : null;
};

// "Sí"/"Si" → true, resta → false
const siNo = (val) => /^s[íi]$/i.test(String(val || "").trim());

// Tradueix fila Excel → camps DB --> Adaptació de les columnes del excel a les taules de la DB
// Les claus de row[] usen EXCEL_HEADERS per a la validació, però el mapping és manual per a més control i robustesa davant accents
const parseExcelRow = (row) => {
    const baixa    = String(row["BAIXA"] || "").trim();
    const baixaLow = baixa.toLowerCase();

    return {
        curso: {
            nombre:       row["CURS"],
            codigo_curso: row["NUM GIA"],
            codigo:       row["NUM GIA"],
            fecha_inicio: dateEuToMysql(row["DATA INICI"]),
            fecha_fin:    dateEuToMysql(row["DATA FI"]),
        },
        alumno: {
            nombre:          row["NOM"],
            apellidos:       row["COGNOMS"],
            dni:             row["DNI"],
            email:           row["CORREU ELECTRONIC"] || null,
            telefono:        row["TELEFON"] || null,
            cesion_material: siNo(row["CESSIO MATERIAL DIDACTIC"]),
            derechos_imagen: siNo(row["DRETS D'IMATES"]),
            accion_difusion: siNo(row["REBRE INFORMACIO"]),
            comentarios: (baixaLow && baixaLow !== "no" && !/^s[íi]$/.test(baixaLow))
                ? baixa : null,
        },
        curso_alumno: {
            estat: (!baixaLow || baixaLow === "no") ? 1 : 0,
        },
    };
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
    upload,
    getAll,
    renderNewAlumno,
    createAlumno,
    getById,
    deleteAlumno,
    searchAlumno,
    exportCsv,
    importCsv,
    updateAlumno,
};