package cl.servicestar.api.service;

import cl.servicestar.api.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

// Genera los tokens JWT que identifican al usuario después de iniciar sesión.
@Service
public class TokenService {

    private final JwtEncoder encoder;
    private final long expiracionMinutos;

    public TokenService(JwtEncoder encoder, @Value("${app.jwt.expiracion-minutos}") long expiracionMinutos) {
        this.encoder = encoder;
        this.expiracionMinutos = expiracionMinutos;
    }

    // Devuelve el token firmado y la fecha en que expira.
    public TokenGenerado generar(Usuario usuario) {
        Instant ahora = Instant.now();
        Instant expira = ahora.plus(expiracionMinutos, ChronoUnit.MINUTES);

        // Claims: datos que viajan dentro del token.
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("servicestar-api")           // quién emitió el token
                .issuedAt(ahora)                      // cuándo se emitió
                .expiresAt(expira)                    // cuándo deja de ser válido
                .subject(usuario.getCorreo())         // a quién identifica
                .claim("nombre", usuario.getNombre())
                .claim("rol", usuario.getRol())       // se usa para autorizar por rol
                .build();

        // Se firma con HMAC-SHA256 usando la clave secreta del servidor.
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new TokenGenerado(token, expira);
    }

    public record TokenGenerado(String token, Instant expiraEn) {
    }
}
