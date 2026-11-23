package cl.servicestar.api.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

// Persona que puede iniciar sesión en la aplicación.
@Data
@Entity
@Table(name = "usuario")
public class Usuario {

    // Roles disponibles.
    // ADMIN: gestiona todos los requerimientos. CLIENTE: ve solo los suyos.
    public static final String ROL_ADMIN = "ADMIN";
    public static final String ROL_CLIENTE = "CLIENTE";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, length = 150, unique = true)
    private String correo;

    // Guarda el hash BCrypt de la contraseña, nunca el texto original.
    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false, length = 20)
    private String rol;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void asignarFechaCreacion() {
        this.fechaCreacion = LocalDateTime.now();
    }
}
