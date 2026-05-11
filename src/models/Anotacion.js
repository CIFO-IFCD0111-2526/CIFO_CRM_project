const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// -------------------------------------------------------
// Modelo: Anotacion
// Tabla: anotaciones
// -------------------------------------------------------

const Anotacion = sequelize.define(
    "Anotacion",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },

        usuario_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },

        contenido: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "El contingut no pot estar buit",
                },
            },
        },
    },
    {
        tableName: "anotaciones",
        // timestamps y underscored heredados globalmente
    }
);

module.exports = Anotacion;