const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { sequelize } = require('../config/database');

const Usuarios = sequelize.define(
    "Usuarios",
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
                notEmpty: { msg: "El nombre no puede estar vacío" },
                len: { args: [2, 100], msg: "El nombre debe tener entre 2 y 100 caracteres" },
            },
        },
        apellidos: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                notEmpty: { msg: "Los apellidos no pueden estar vacíos" },
            },
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: { msg: "Este email ya está registrado" },
            validate: {
                isEmail: { msg: "Debe ser un email válido" },
            },
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                len: { args: [6, 255], msg: "La contraseña debe tener al menos 6 caracteres" },
            },
        },
        nivel_acceso: {
            type: DataTypes.ENUM("admin", "editor", "lector"),
            allowNull: false,
            defaultValue: "lector",
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
    // Hooks para hashear contraseña
    hooks: {
        beforeCreate: async (Usuario) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10); 
                user.password = await bcrypt.hash(Usuario.password, salt); // Hashear
            }
        },
        beforeUpdate: async (Usuario) => {
            if (Usuario.password) {
                const salt = await bcrypt.genSalt(10);
                Usuario.password = await bcrypt.hash(Usuario.password, salt);
            }
        }
    }
},
    {
        tableName: "usuarios",
        // timestamps y underscored ya definidos globalmente en config/database.js
    });

module.exports = Usuario;
