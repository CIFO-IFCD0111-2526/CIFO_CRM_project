-- Migration 003: En la tabla cursos renombrar la columna codigo por codigo_curso
-- y añadir la columna codigo_accion_formativa.
-- Issue: #150, PR: #171
-- Fecha: 2026-05-13
--
-- sequelize.sync() no modifica columnas existentes. Ejecutar manualmente:

-- Renombrar la columna codigo a codigo_curso.
-- Usamos CHANGE (compatible con MySQL 5.7+ y MariaDB) en vez de RENAME COLUMN (solo MySQL 8+).
ALTER TABLE cursos CHANGE codigo codigo_curso VARCHAR(32) NOT NULL;

-- Añadir codigo_accion_formativa.
-- Allow NULL para no romper las filas existentes; el modelo lo marca como allowNull: true.
ALTER TABLE cursos ADD COLUMN codigo_accion_formativa VARCHAR(16) NULL;
