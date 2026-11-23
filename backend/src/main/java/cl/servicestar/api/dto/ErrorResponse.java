package cl.servicestar.api.dto;

import java.util.Map;

// Formato común de los errores que devuelve la API.
// errores: mensaje por campo cuando falla una validación (puede ser null).
public record ErrorResponse(int status, String mensaje, Map<String, String> errores) {
}
