const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// -------------------------------------------------------
// Modelo: Documento
// Tabla: documentos
// -------------------------------------------------------

const Documento = sequelize.define(
    "Documento",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },

        entidad_tipo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: {
                    args: [["Alumno", "Curso", "Profesor"]],
                    msg: "El tipus d'entitat no és vàlid",
                },
                notEmpty: {
                    msg: "El tipus d'entitat és obligatori",
                },
            },
        },

        entidad_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "L'id de l'entitat és obligatori",
                },
                isInt: {
                    msg: "L'id de l'entitat ha de ser un enter",
                },
            },
        },

        nombre_original: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "El nom original és obligatori",
                },
            },
        },

        nombre_fichero: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "El nom del fitxer és obligatori",
                },
            },
        },

        mime_type: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },

        tamano: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            validate: {
                isInt: {
                    msg: "La mida ha de ser un enter",
                },
            },
        },

        usuario_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: "usuarios",
                key: "id",
            },
        },
    },
    {
        tableName: "documentos",

        indexes: [
            {
                fields: ["entidad_tipo", "entidad_id"],
            },
        ],
    }
);

module.exports = Documento;