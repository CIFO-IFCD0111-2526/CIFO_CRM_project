-- Migration 001: En la tabla cursos renombrar la columna requisitos por nivel
-- Issue: #149, PR: #164
-- Fecha: 2026-05-13
--
-- sequelize.sync({ alter: true }) añadirá la columna nivel, pero no eliminará automáticamente requisitos.
-- Ejecutar manualmente:

ALTER TABLE cursos
CHANGE requisitos nivel INTEGER;