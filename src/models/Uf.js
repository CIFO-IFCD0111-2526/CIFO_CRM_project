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
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: "El codi no pot estar buit" },
                len: { args: [2, 32], msg: "El codi ha de tenir entre 2 i 32 caràcters"
                },
            }
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: { msg: "El nom no pot estar buit" },
                len: { args: [2, 100], msg: "El nom ha de tenir entre 2 i 100 caràcters" },
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

