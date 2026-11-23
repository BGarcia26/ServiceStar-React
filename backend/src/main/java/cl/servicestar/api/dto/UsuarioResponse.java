package cl.servicestar.api.dto;

import cl.servicestar.api.model.Usuario;

// Datos públicos de un usuario. Nunca incluye la contraseña.
public record UsuarioResponse(Long id, String nombre, String correo, String rol) {

    public static UsuarioResponse desde(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getCorreo(), usuario.getRol());
    }
}
