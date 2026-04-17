const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Uf = sequelize.define(
    "Uf",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        codigo: {
            type: DataTypes.STRING(32),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: "El código no puede estar vacío" },
                len: { args: [2, 32], msg: "El código debe tener entre 2 y 32 caracteres"
                },
            }
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: { msg: "El nombre no puede estar vacío" },
                len: { args: [2, 100], msg: "El nombre debe tener entre 2 y 100 caracteres" },
            },
        },
        horas: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        tableName: "ufs",
    });

module.exports = Uf;

