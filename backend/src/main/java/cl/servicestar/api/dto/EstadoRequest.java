package cl.servicestar.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

// Cuerpo de la petición para cambiar el estado de un requerimiento.
public record EstadoRequest(

        @NotBlank(message = "El estado es obligatorio.")
        @Pattern(regexp = "PENDIENTE|ATENDIDO", message = "El estado debe ser PENDIENTE o ATENDIDO.")
        String estado
) {
}
