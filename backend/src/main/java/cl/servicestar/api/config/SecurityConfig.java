package cl.servicestar.api.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.List;

// Configuración de seguridad: qué rutas son públicas, cuáles requieren
// token y qué rol necesita cada una.
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filtros(HttpSecurity http) throws Exception {
        http
                // API REST sin formularios HTML ni cookies: no se usa CSRF.
                .csrf(csrf -> csrf.disable())
                // Permite las peticiones del frontend (ver corsConfigurationSource).
                .cors(cors -> {})
                // Sin sesión en el servidor: cada petición trae su token (stateless).
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Documentación Swagger: pública.
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // Registro e inicio de sesión: públicos.
                        .requestMatchers(HttpMethod.POST, "/api/auth/registro", "/api/auth/login").permitAll()
                        // Cualquier visitante puede enviar el formulario de contacto.
                        .requestMatchers(HttpMethod.POST, "/api/contactos").permitAll()
                        // Un cliente solo puede ver sus propios requerimientos.
                        .requestMatchers(HttpMethod.GET, "/api/contactos/mios").hasAnyRole("CLIENTE", "ADMIN")
                        // Listar, editar, cambiar estado y eliminar: solo ADMIN.
                        .requestMatchers("/api/contactos/**").hasRole("ADMIN")
                        // El resto (por ejemplo /api/auth/perfil) solo exige estar autenticado.
                        .anyRequest().authenticated())
                // Valida el token JWT del header "Authorization: Bearer <token>".
                .oauth2ResourceServer(oauth -> oauth.jwt(jwt -> jwt.jwtAuthenticationConverter(convertidorDeRoles())));
        return http.build();
    }

    // Lee el claim "rol" del token y lo convierte en autoridad ROLE_ADMIN o ROLE_CLIENTE,
    // que es lo que revisan las reglas hasRole(...).
    private JwtAuthenticationConverter convertidorDeRoles() {
        JwtGrantedAuthoritiesConverter roles = new JwtGrantedAuthoritiesConverter();
        roles.setAuthoritiesClaimName("rol");
        roles.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter convertidor = new JwtAuthenticationConverter();
        convertidor.setJwtGrantedAuthoritiesConverter(roles);
        return convertidor;
    }

    // Clave secreta compartida para firmar y verificar los tokens (HMAC-SHA256).
    @Bean
    public SecretKey claveJwt(@Value("${app.jwt.secreto}") String secreto) {
        if (secreto.length() < 32) {
            throw new IllegalStateException("app.jwt.secreto debe tener al menos 32 caracteres.");
        }
        return new SecretKeySpec(secreto.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    // Crea (firma) tokens. Lo usa TokenService al iniciar sesión.
    @Bean
    public JwtEncoder jwtEncoder(SecretKey clave) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(clave));
    }

    // Verifica la firma y la expiración de los tokens que llegan en cada petición.
    @Bean
    public JwtDecoder jwtDecoder(SecretKey clave) {
        return NimbusJwtDecoder.withSecretKey(clave).macAlgorithm(MacAlgorithm.HS256).build();
    }

    // Cifra las contraseñas con BCrypt antes de guardarlas.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // CORS: autoriza al frontend de Vite (otro puerto = otro origen) a llamar a la API.
    @Bean
    public CorsConfigurationSource corsConfigurationSource(@Value("${app.cors.origen}") String origen) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(origen));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
