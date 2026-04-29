const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// -------------------------------------------------------
// Modelo: Profesor
// Tabla:  profesores
// -------------------------------------------------------

const Profesor = sequelize.define(
  "Profesor",
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
        len: { args: [2, 150], msg: "Els cognoms han de tenir entre 2 i 150 caràcters" },
      },
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
            args: /^\+?[0-9\s\-()]{7,20}$/,
            msg: "Formato de teléfono inválido"
        },
      },  
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: { msg: "Este email ya está registrado" },
      validate: {
        notEmpty: {msg: "El email no puede estar vacío"},
        isEmail: { msg: "Debe ser un email válido" },
      },
    },
  },
  {
    tableName: "profesores",
    // timestamps y underscored ya definidos globalmente en config/database.js
  }
);

module.exports = Profesor;
