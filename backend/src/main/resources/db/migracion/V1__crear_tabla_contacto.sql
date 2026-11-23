-- Crea la tabla que guarda los requerimientos enviados desde el formulario de contacto.
CREATE TABLE contacto (
    id BIGINT NOT NULL AUTO_INCREMENT,          -- Identificador único generado automáticamente por MySQL.
    nombre_completo VARCHAR(150) NOT NULL,      -- Nombre o empresa de quien envía el requerimiento.
    correo VARCHAR(150) NOT NULL,               -- Correo corporativo de contacto.
    mensaje TEXT NOT NULL,                      -- Detalle del requerimiento. TEXT permite textos extensos.
    fecha_creacion DATETIME(6) NOT NULL,        -- Fecha y hora de creación, asignadas desde el modelo con @PrePersist.
    PRIMARY KEY (id)                            -- Define el identificador como clave primaria.
);
