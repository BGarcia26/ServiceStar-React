-- Crea la tabla de usuarios que pueden iniciar sesión.
CREATE TABLE usuario (
    id BIGINT NOT NULL AUTO_INCREMENT,          -- Identificador único del usuario.
    nombre VARCHAR(150) NOT NULL,               -- Nombre que se muestra en la aplicación.
    correo VARCHAR(150) NOT NULL,               -- Correo con el que inicia sesión.
    password VARCHAR(100) NOT NULL,             -- Contraseña cifrada con BCrypt (nunca en texto plano).
    rol VARCHAR(20) NOT NULL,                   -- ADMIN o CLIENTE: define a qué recursos puede acceder.
    fecha_creacion DATETIME(6) NOT NULL,        -- Fecha y hora de registro.
    PRIMARY KEY (id),
    CONSTRAINT uk_usuario_correo UNIQUE (correo) -- No pueden existir dos usuarios con el mismo correo.
);
