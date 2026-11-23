package cl.servicestar.api.service;

import cl.servicestar.api.dto.AuthResponse;
import cl.servicestar.api.dto.LoginRequest;
import cl.servicestar.api.dto.RegistroRequest;
import cl.servicestar.api.dto.UsuarioResponse;
import cl.servicestar.api.exception.CorreoYaRegistradoException;
import cl.servicestar.api.exception.CredencialesInvalidasException;
import cl.servicestar.api.exception.RecursoNoEncontradoException;
import cl.servicestar.api.model.Usuario;
import cl.servicestar.api.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Lógica de registro, inicio de sesión y perfil del usuario.
@Service
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(UsuarioRepository repository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    // Crea una cuenta con rol CLIENTE y deja la sesión iniciada.
    @Transactional
    public AuthResponse registrar(RegistroRequest datos) {
        String correo = datos.correo().trim().toLowerCase();
        if (repository.existsByCorreoIgnoreCase(correo)) {
            throw new CorreoYaRegistradoException("Ya existe una cuenta con el correo " + correo + ".");
        }
        Usuario usuario = new Usuario();
        usuario.setNombre(datos.nombre().trim());
        usuario.setCorreo(correo);
        // La contraseña se guarda cifrada con BCrypt.
        usuario.setPassword(passwordEncoder.encode(datos.password()));
        // Quien se registra desde la web siempre es CLIENTE; ADMIN no se puede autoasignar.
        usuario.setRol(Usuario.ROL_CLIENTE);
        return respuestaCon(repository.save(usuario));
    }

    // Verifica las credenciales y entrega un token JWT.
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest datos) {
        Usuario usuario = repository.findByCorreoIgnoreCase(datos.correo().trim())
                .filter(u -> passwordEncoder.matches(datos.password(), u.getPassword()))
                // Mismo mensaje si falla el correo o la contraseña, para no revelar qué cuentas existen.
                .orElseThrow(() -> new CredencialesInvalidasException("Correo o contraseña incorrectos."));
        return respuestaCon(usuario);
    }

    // Datos del usuario dueño del token (se usa al recargar la página).
    @Transactional(readOnly = true)
    public UsuarioResponse perfil(String correo) {
        return repository.findByCorreoIgnoreCase(correo)
                .map(UsuarioResponse::desde)
                .orElseThrow(() -> new RecursoNoEncontradoException("El usuario ya no existe."));
    }

    private AuthResponse respuestaCon(Usuario usuario) {
        TokenService.TokenGenerado token = tokenService.generar(usuario);
        return new AuthResponse(token.token(), token.expiraEn(), UsuarioResponse.desde(usuario));
    }
}
