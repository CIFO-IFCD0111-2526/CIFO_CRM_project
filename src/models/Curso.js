const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");



const Curso = sequelize.define(
    "Curso",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: { msg: "El nombre del curso no puede estar vacío" },
                len: { args: [2, 100], msg: "El nombre debe tener entre 2 y 100 caracteres" },
            },
        },
        codigo: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        fecha_inicio: {
            type: DataTypes.DATE,
        },
        fecha_fin: {
            type: DataTypes.DATE,
        },
        requisitos: {
            type: DataTypes.INTEGER,
            get() {
                const niveles = {
                    0: "Sense estudis",
                    1: "Primària",
                    2: "Secundària",
                    4: "FP Grau Mitjà",
                    5: "Batxillerat",
                    6: "FP Grau Superior"
                };

                return niveles[this.getDataValue("requisitos")] ?? "—";
            }
        },
    },
    {
        tableName: "cursos",
        // timestamps y underscored ya definidos globalmente en config/database.js
    }
);




module.exports = Curso;
