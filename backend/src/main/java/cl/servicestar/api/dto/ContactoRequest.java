package cl.servicestar.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// Datos que React envía al crear o editar un requerimiento.
// Las validaciones son las mismas del formulario del frontend:
// el backend no confía en que el navegador ya haya validado.
public record ContactoRequest(

        @NotBlank(message = "El nombre es obligatorio.")
        @Size(min = 3, max = 150, message = "El nombre debe tener entre 3 y 150 caracteres.")
        String nombreCompleto,

        @NotBlank(message = "El correo es obligatorio.")
        @Email(message = "Ingresa un correo válido.")
        @Size(max = 150, message = "El correo no puede superar los 150 caracteres.")
        String correo,

        // Opcional: si viene, debe tener entre 8 y 15 dígitos (puede empezar con +).
        @Pattern(regexp = "^$|^\\+?[0-9\\s]{8,15}$", message = "Formato de teléfono inválido. Ej: +56 9 1234 5678")
        String telefono,

        @NotBlank(message = "El mensaje es obligatorio.")
        @Size(min = 10, max = 2000, message = "El mensaje debe tener entre 10 y 2000 caracteres.")
        String mensaje
) {
}
