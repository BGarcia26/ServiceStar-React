package cl.servicestar.api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// Información general que muestra Swagger UI y el botón "Authorize"
// para probar los endpoints protegidos con un token JWT.
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI documentacion() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Service Star")
                        .version("1.0")
                        .description("Requerimientos de contacto y autenticación con JWT. "
                                + "Para probar los endpoints protegidos: ejecuta POST /api/auth/login, "
                                + "copia el token y pégalo en Authorize."))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
