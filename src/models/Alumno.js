const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// -------------------------------------------------------
// Modelo: Alumno
// Tabla:  alumnos
// -------------------------------------------------------

const Alumno = sequelize.define(
  "Alumno",
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

    dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        msg: "Aquest DNI ja està registrat",
      },
      validate: {
        notEmpty: {
          msg: "El DNI no pot estar buit",
        },
      },
    },

    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: {
          msg: "Ha de ser un email vàlid",
        },
      },
    },

    nivel_estudios: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    tipo: {
      type: DataTypes.ENUM("actual", "antiguo", "futuro"),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El tipus és obligatori",
        },
      },
    },

    derechos_imagen: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },

    cesion_material: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },

    comentarios: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    ultimo_id_modif: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
  },
  {
    tableName: "alumnos",

  }
);

module.exports = Alumno;