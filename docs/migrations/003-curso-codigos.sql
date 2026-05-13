-- Migration 003: En la tabla cursos renombrar la columna codigo por codigo_curso, tambien agregar la columna codigo_fecha
-- Issue: #150, PR: #171
-- Fecha: 2026-05-13
--
-- sequelize.sync({ alter: true }) añadirá la columna nivel, pero no eliminará automáticamente requisitos.
-- Ejecutar manualmente:
ALTER TABLE cursos rename codigo to codigo_curso;
-- No es necesario modificar más el codigo_curso porque ya es VARCHAR(32) y NOT NULL
ALTER TABLE cursos ADD COLUMN codigo_accion_formativa VARCHAR(16) NOT NULL;