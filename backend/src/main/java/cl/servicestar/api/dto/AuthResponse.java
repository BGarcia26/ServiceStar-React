package cl.servicestar.api.dto;

import java.time.Instant;

// Respuesta al iniciar sesión o registrarse:
// el token JWT, cuándo expira y los datos del usuario.
public record AuthResponse(String token, Instant expiraEn, UsuarioResponse usuario) {
}
