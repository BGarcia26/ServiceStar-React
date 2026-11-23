-- Agrega la columna estado a la tabla contacto ya existente.
-- Los contactos existentes quedarán con estado PENDIENTE.
ALTER TABLE contacto
ADD COLUMN estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE';
