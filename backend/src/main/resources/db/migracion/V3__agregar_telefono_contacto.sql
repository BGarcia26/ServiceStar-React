-- El formulario de Service Star también pide un teléfono, que es opcional.
ALTER TABLE contacto
ADD COLUMN telefono VARCHAR(20) NULL;
