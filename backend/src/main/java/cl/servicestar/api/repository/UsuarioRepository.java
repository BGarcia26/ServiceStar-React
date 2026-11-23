package cl.servicestar.api.repository;

import cl.servicestar.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Busca un usuario por su correo (se usa al iniciar sesión).
    Optional<Usuario> findByCorreoIgnoreCase(String correo);

    // Indica si ya existe un usuario con ese correo (se usa al registrarse).
    boolean existsByCorreoIgnoreCase(String correo);
}
