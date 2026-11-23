package cl.servicestar.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// Credenciales que se envían al iniciar sesión.
public record LoginRequest(

        @NotBlank(message = "El correo es obligatorio.")
        @Email(message = "Ingresa un correo válido.")
        String correo,

        @NotBlank(message = "La contraseña es obligatoria.")
        String password
) {
}
