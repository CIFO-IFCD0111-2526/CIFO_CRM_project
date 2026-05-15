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
                notEmpty: { msg: "El nom del curs no pot estar buit" },
                len: { args: [2, 100], msg: "El nom ha de tenir entre 2 i 100 caràcters" },
            },
        },
        codigo_curso: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        codigo_accion_formativa: {
            type: DataTypes.STRING(16),
            allowNull: true,
        },
        fecha_inicio: {
            type: DataTypes.DATE,
        },
        fecha_fin: {
            type: DataTypes.DATE,
        },
        nivel: {
            type: DataTypes.INTEGER,
            validate: {min: 1, max: 4},
            get() {
                const niveles = {
                    1: "Nivell 1",
                    2: "Nivell 2",
                    3: "Nivell 3",
                    4: "Nivell 4"
                };
                return niveles[this.getDataValue("nivel")] ?? "—";
            }
        }, estado: {
            type: DataTypes.INTEGER,
            validate: {min: 1, max: 3},
            get() {
                const estados = {
                    1: "Curso Terminado",
                    2: "En curso",
                    3: "Pendiende iniciar",
                };
                return estados[this.getDataValue("estado")] ?? "—";
            }
        },

    },
    {
        tableName: "cursos",
        // timestamps y underscored ya definidos globalmente en config/database.js
    }
);




module.exports = Curso;
