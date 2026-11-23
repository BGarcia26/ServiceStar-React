package cl.servicestar.api;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Pruebas de integración: levantan la API completa (seguridad, controladores,
// servicios, repositorios y migraciones Flyway) sobre una base H2 en memoria.
@SpringBootTest
@ActiveProfiles("test")
class ServicestarApiApplicationTests {

    @Autowired
    private WebApplicationContext contexto;

    private MockMvc mvc;

    @BeforeEach
    void preparar() {
        mvc = MockMvcBuilders.webAppContextSetup(contexto).apply(springSecurity()).build();
    }

    private static final String CONTACTO_VALIDO = """
            {"nombreCompleto":"Empresa Prueba","correo":"cliente@prueba.cl",
             "telefono":"+56 9 1234 5678","mensaje":"Necesito cotizar 10 notebooks."}
            """;

    @Test
    void cualquierVisitantePuedeEnviarUnRequerimiento() throws Exception {
        mvc.perform(post("/api/contactos").contentType(MediaType.APPLICATION_JSON).content(CONTACTO_VALIDO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.estado").value("PENDIENTE"))
                .andExpect(jsonPath("$.fechaCreacion").exists());
    }

    @Test
    void unRequerimientoInvalidoDevuelve400ConElErrorDeCadaCampo() throws Exception {
        String invalido = """
                {"nombreCompleto":"Jo","correo":"correo-malo","mensaje":"corto"}
                """;
        mvc.perform(post("/api/contactos").contentType(MediaType.APPLICATION_JSON).content(invalido))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.nombreCompleto").exists())
                .andExpect(jsonPath("$.errores.correo").exists())
                .andExpect(jsonPath("$.errores.mensaje").exists());
    }

    @Test
    void sinTokenNoSePuedenListarLosRequerimientos() throws Exception {
        mvc.perform(get("/api/contactos")).andExpect(status().isUnauthorized());
    }

    @Test
    void unaContrasenaIncorrectaDevuelve401() throws Exception {
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"correo\":\"admin@servicestar.cl\",\"password\":\"incorrecta\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void unClienteSoloVeSusPropiosRequerimientos() throws Exception {
        String respuesta = mvc.perform(post("/api/auth/registro").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Cliente Uno\",\"correo\":\"uno@cliente.cl\",\"password\":\"Cliente123\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usuario.rol").value("CLIENTE"))
                .andReturn().getResponse().getContentAsString();
        String token = JsonPath.read(respuesta, "$.token");

        mvc.perform(post("/api/contactos").contentType(MediaType.APPLICATION_JSON)
                .content(CONTACTO_VALIDO.replace("cliente@prueba.cl", "uno@cliente.cl")));

        // Rol CLIENTE: no puede ver la lista completa (403)...
        mvc.perform(get("/api/contactos").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
        // ...pero sí los suyos.
        mvc.perform(get("/api/contactos/mios").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].correo").value("uno@cliente.cl"));
        // El perfil se obtiene desde el token.
        mvc.perform(get("/api/auth/perfil").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correo").value("uno@cliente.cl"));
    }

    @Test
    void elAdministradorPuedeHacerElCrudCompleto() throws Exception {
        String login = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"correo\":\"admin@servicestar.cl\",\"password\":\"Admin123*\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usuario.rol").value("ADMIN"))
                .andReturn().getResponse().getContentAsString();
        String bearer = "Bearer " + JsonPath.<String>read(login, "$.token");

        // CREATE
        String creado = mvc.perform(post("/api/contactos").contentType(MediaType.APPLICATION_JSON).content(CONTACTO_VALIDO))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        Integer id = JsonPath.read(creado, "$.id");

        // READ
        mvc.perform(get("/api/contactos").header("Authorization", bearer))
                .andExpect(status().isOk());
        mvc.perform(get("/api/contactos/" + id).header("Authorization", bearer))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombreCompleto").value("Empresa Prueba"));

        // UPDATE (datos)
        mvc.perform(put("/api/contactos/" + id).header("Authorization", bearer)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(CONTACTO_VALIDO.replace("Empresa Prueba", "Empresa Editada")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombreCompleto").value("Empresa Editada"));

        // UPDATE (estado)
        mvc.perform(put("/api/contactos/" + id + "/estado").header("Authorization", bearer)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"estado\":\"ATENDIDO\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("ATENDIDO"));

        // DELETE
        mvc.perform(delete("/api/contactos/" + id).header("Authorization", bearer))
                .andExpect(status().isNoContent());
        mvc.perform(get("/api/contactos/" + id).header("Authorization", bearer))
                .andExpect(status().isNotFound());
    }

    @Test
    void swaggerDocumentaLosEndpoints() throws Exception {
        mvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paths['/api/contactos/{id}']").exists())
                .andExpect(jsonPath("$.paths['/api/auth/login']").exists());
    }
}
