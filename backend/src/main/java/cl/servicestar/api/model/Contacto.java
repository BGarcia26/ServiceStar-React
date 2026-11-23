package cl.servicestar.api.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

// Representa un requerimiento enviado desde el formulario de contacto.
@Data
@Entity
@Table(name = "contacto")
public class Contacto {

    // Estados posibles de un requerimiento.
    public static final String PENDIENTE = "PENDIENTE";
    public static final String ATENDIDO = "ATENDIDO";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_completo", nullable = false, length = 150)
    private String nombreCompleto;

    @Column(nullable = false, length = 150)
    private String correo;

    // Opcional: puede quedar vacío.
    @Column(length = 20)
    private String telefono;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;

    // Estado inicial del requerimiento.
    @Column(nullable = false, length = 20)
    private String estado = PENDIENTE;

    // Vincula el atributo Java con la columna fecha_creacion de MySQL.
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    // Asigna automáticamente la fecha y hora antes de insertar el contacto.
    @PrePersist
    protected void asignarFechaCreacion() {
        this.fechaCreacion = LocalDateTime.now();
    }
}
