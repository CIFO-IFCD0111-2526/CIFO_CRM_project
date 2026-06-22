-- Migration 004: añadir columnas apte y fecha_baixa a la tabla pivot curso_alumno
-- Issue: #193, PR: #201
-- Fecha: 2026-06-22
--
-- sequelize.sync() no añade columnas a tablas existentes, así que estas
-- columnas hay que crearlas manualmente.
--
-- apte         → TINYINT(1) (BOOLEAN), NULL = alumno aún no evaluado.
-- fecha_baixa  → DATE,       NULL = sin baja.
-- Ambas allowNull en el modelo (src/models/index.js), por eso DEFAULT NULL
-- para no romper las filas de matrícula existentes.

ALTER TABLE curso_alumno
  ADD COLUMN apte TINYINT(1) DEFAULT NULL,
  ADD COLUMN fecha_baixa DATE DEFAULT NULL;
