-- Migration 001: añadir columna accion_difusion a alumnos
-- Issue: #147, PR: #154
-- Fecha: 2026-05-12
--
-- sequelize.sync() no añade columnas a tablas existentes,
-- así que esta columna hay que crearla manualmente.

ALTER TABLE alumnos
  ADD COLUMN accion_difusion TINYINT(1) DEFAULT 0;
