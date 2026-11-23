package cl.servicestar.api.config;

import cl.servicestar.api.model.Usuario;
import cl.servicestar.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Se ejecuta una vez al iniciar la API.
// Crea el usuario ADMIN si todavía no existe, porque desde la web
// solo se pueden registrar cuentas CLIENTE.
@Component
public class DatosIniciales implements CommandLineRunner {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final String nombre;
    private final String correo;
    private final String password;

    public DatosIniciales(UsuarioRepository repository, PasswordEncoder passwordEncoder,
                          @Value("${app.admin.nombre}") String nombre,
                          @Value("${app.admin.correo}") String correo,
                          @Value("${app.admin.password}") String password) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.nombre = nombre;
        this.correo = correo;
        this.password = password;
    }

    @Override
    public void run(String... args) {
        if (repository.existsByCorreoIgnoreCase(correo)) {
            return;
        }
        Usuario admin = new Usuario();
        admin.setNombre(nombre);
        admin.setCorreo(correo);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRol(Usuario.ROL_ADMIN);
        repository.save(admin);
    }
}
