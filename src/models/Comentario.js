const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// -------------------------------------------------------
// Modelo: Comentario
// Tabla: comentarios
// -------------------------------------------------------

const Comentario = sequelize.define(
    "Comentario",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },

        alumno_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },

        usuario_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },

        texto: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "El comentari no pot estar buit",
                },
            },
        },
    },
    {
        tableName: "comentarios",
        // timestamps y underscored heredados globalmente
    }
);

module.exports = Comentario;