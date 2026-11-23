package cl.servicestar.api.exception;

// Se lanza cuando el correo o la contraseña no son correctos (responde 401).
public class CredencialesInvalidasException extends RuntimeException {

    public CredencialesInvalidasException(String mensaje) {
        super(mensaje);
    }
}
