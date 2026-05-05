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
        notEmpty: { msg: "El nom no pot estar buit" },
        len: { args: [2, 100], msg: "El nom ha de tenir entre 2 i 100 caràcters" },
      },
    },
    apellidos: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Els cognoms no poden estar buits" },
        len: { args: [2, 150], msg: "Els cognoms han de tenir entre 2 i 150 caràcters" },
      },
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
            args: /^\+?[0-9\s\-()]{7,20}$/,
            msg: "Format de telèfon invàlid"
        },
      },  
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: { msg: "Aquest email ja està registrat" },
      validate: {
        notEmpty: {msg: "L'email no pot estar buit"},
        isEmail: { msg: "Ha de ser un email vàlid" },
      },
    },
  },
  {
    tableName: "profesores",
    // timestamps y underscored ya definidos globalmente en config/database.js
  }
);

module.exports = Profesor;
