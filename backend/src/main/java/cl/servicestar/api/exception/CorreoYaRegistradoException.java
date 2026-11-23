package cl.servicestar.api.exception;

// Se lanza al registrar un correo que ya tiene cuenta (responde 409).
public class CorreoYaRegistradoException extends RuntimeException {

    public CorreoYaRegistradoException(String mensaje) {
        super(mensaje);
    }
}
