INSERT INTO usuarios (nombre, apellidos, email, password, nivel_acceso, activo, created_at, updated_at)
VALUES
  ('Ana', 'García López', 'ana.garcia@cifo.cat', '123456', 'admin', 1, NOW(), NOW()),
  ('Marc', 'Fernández Ruiz', 'marc.fernandez@cifo.cat', '123456', 'editor', 1, NOW(), NOW());
