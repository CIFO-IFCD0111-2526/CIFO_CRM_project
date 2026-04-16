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

    dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        msg: "Este DNI ya está registrado",
      },
      validate: {
        notEmpty: {
          msg: "El DNI no puede estar vacío",
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
          msg: "Debe ser un email válido",
        },
      },
    },

    nivel_estudios: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    tipo: {
      type: DataTypes.ENUM("actual", "antiguo", "futuro"),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El tipo es obligatorio",
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