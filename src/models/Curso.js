const Curso = sequelize.define( // asdasda
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
                notEmpty: { msg: "El nombre no puede estar vacío" },
                len: { args: [2, 100], msg: "El nombre debe tener entre 2 y 100 caracteres" },
            },
        },

        codigo: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },

        horas: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

    },
    {
        tableName: "Cursos",
        // timestamps y underscored ya definidos globalmente en config/database.js
    }
);

module.exports = Curso;
