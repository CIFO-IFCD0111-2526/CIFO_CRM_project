const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// -------------------------------------------------------
// Modelo: Usuario
// Tabla:  usuarios
// -------------------------------------------------------

const Usuario = sequelize.define(
  "Usuario",
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
        notEmpty: { msg: "El nom no pot estar buit" },
        len: { args: [2, 100], msg: "El nom ha de tenir entre 2 i 100 caràcters" },
      },
    },
    apellidos: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Els cognoms no poden estar buits" },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: { msg: "Aquest email ja està registrat" },
      validate: {
        isEmail: { msg: "Ha de ser un email vàlid" },
      },
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      /*validate: {
        len: { args: [6, 255], msg: "La contraseña debe tener al menos 6 caracteres" },
      },*/ //no es necesario validar porque la constraseña se recibe hasheada
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
  },
  {
    tableName: "usuarios",
    // timestamps y underscored ya definidos globalmente en config/database.js
  }
);

module.exports = Usuario;
