package cl.servicestar.api.controller;

import cl.servicestar.api.dto.ContactoRequest;
import cl.servicestar.api.dto.EstadoRequest;
import cl.servicestar.api.model.Contacto;
import cl.servicestar.api.service.ContactoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Expone endpoints HTTP y devuelve los datos como JSON.
// Los permisos por rol de cada ruta están en config/SecurityConfig.
@RestController
// Ruta base para las peticiones de requerimientos de contacto.
@RequestMapping("/api/contactos")
@Tag(name = "Contactos", description = "CRUD de los requerimientos enviados desde el formulario de contacto")
public class ContactoController {

    private final ContactoService service;

    // Spring inyecta el servicio mediante el constructor.
    public ContactoController(ContactoService service) {
        this.service = service;
    }

    // POST: recibe un JSON y registra un nuevo requerimiento. Es público.
    @PostMapping
    @Operation(summary = "Crear un requerimiento", description = "Público. Lo usa el formulario de contacto del sitio.")
    public ResponseEntity<Contacto> guardar(@Valid @RequestBody ContactoRequest datos) {
        Contacto guardado = service.guardar(datos);
        // Devuelve el requerimiento guardado y el código HTTP 201.
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    // GET: devuelve todos los requerimientos como una lista JSON. Solo ADMIN.
    @GetMapping
    @Operation(summary = "Listar todos los requerimientos", description = "Solo ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth"))
    public List<Contacto> listar() {
        return service.listar();
    }

    // GET: los requerimientos del usuario que inició sesión (según el correo del token).
    @GetMapping("/mios")
    @Operation(summary = "Listar mis requerimientos", description = "CLIENTE o ADMIN. Filtra por el correo del token.",
            security = @SecurityRequirement(name = "bearerAuth"))
    public List<Contacto> listarMios(@AuthenticationPrincipal Jwt jwt) {
        return service.listarPorCorreo(jwt.getSubject());
    }

    // GET: un requerimiento por id. Solo ADMIN.
    @GetMapping("/{id}")
    @Operation(summary = "Obtener un requerimiento por id", description = "Solo ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth"))
    public Contacto buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    // PUT: reemplaza los datos de un requerimiento. Solo ADMIN.
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un requerimiento", description = "Solo ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth"))
    public Contacto actualizar(@PathVariable Long id, @Valid @RequestBody ContactoRequest datos) {
        return service.actualizar(id, datos);
    }

    // PUT: cambia el estado (PENDIENTE / ATENDIDO). Solo ADMIN.
    @PutMapping("/{id}/estado")
    @Operation(summary = "Cambiar el estado de un requerimiento", description = "Solo ADMIN. Valores: PENDIENTE o ATENDIDO.",
            security = @SecurityRequirement(name = "bearerAuth"))
    public Contacto cambiarEstado(@PathVariable Long id, @Valid @RequestBody EstadoRequest datos) {
        return service.cambiarEstado(id, datos.estado());
    }

    // DELETE: elimina un requerimiento y responde 204 (sin contenido). Solo ADMIN.
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un requerimiento", description = "Solo ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
