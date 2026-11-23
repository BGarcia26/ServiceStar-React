package cl.servicestar.api.controller;

import cl.servicestar.api.dto.AuthResponse;
import cl.servicestar.api.dto.LoginRequest;
import cl.servicestar.api.dto.RegistroRequest;
import cl.servicestar.api.dto.UsuarioResponse;
import cl.servicestar.api.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

// Endpoints de autenticación: registro, inicio de sesión y perfil.
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Registro, inicio de sesión con JWT y perfil del usuario")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/registro")
    @Operation(summary = "Crear una cuenta de cliente", description = "Público. Devuelve un token JWT con rol CLIENTE.")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody RegistroRequest datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(datos));
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Público. Devuelve un token JWT para enviar en el header Authorization.")
    public AuthResponse login(@Valid @RequestBody LoginRequest datos) {
        return service.login(datos);
    }

    // El correo se obtiene del token: no hace falta enviarlo.
    @GetMapping("/perfil")
    @Operation(summary = "Datos del usuario autenticado", description = "Requiere token. React lo usa para validar la sesión al recargar.",
            security = @SecurityRequirement(name = "bearerAuth"))
    public UsuarioResponse perfil(@AuthenticationPrincipal Jwt jwt) {
        return service.perfil(jwt.getSubject());
    }
}
