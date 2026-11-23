package cl.servicestar.api.service;

import cl.servicestar.api.dto.ContactoRequest;
import cl.servicestar.api.exception.RecursoNoEncontradoException;
import cl.servicestar.api.model.Contacto;
import cl.servicestar.api.repository.ContactoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Indica que esta clase contiene la lógica del negocio de los requerimientos.
@Service
public class ContactoService {

    private final ContactoRepository repository;

    // Spring inyecta el repositorio mediante el constructor.
    public ContactoService(ContactoRepository repository) {
        this.repository = repository;
    }

    // CREATE: guarda un nuevo requerimiento.
    @Transactional
    public Contacto guardar(ContactoRequest datos) {
        Contacto contacto = new Contacto();
        copiarDatos(datos, contacto);
        // Todo requerimiento nuevo comienza como pendiente.
        contacto.setEstado(Contacto.PENDIENTE);
        // La fecha se asigna desde el @PrePersist del modelo.
        return repository.save(contacto);
    }

    // READ: todos los requerimientos, del más reciente al más antiguo.
    @Transactional(readOnly = true)
    public List<Contacto> listar() {
        return repository.findAllByOrderByFechaCreacionDesc();
    }

    // READ: solo los requerimientos enviados con un correo (los del cliente que inició sesión).
    @Transactional(readOnly = true)
    public List<Contacto> listarPorCorreo(String correo) {
        return repository.findByCorreoIgnoreCaseOrderByFechaCreacionDesc(correo);
    }

    // READ: un requerimiento por su id. Si no existe, responde 404.
    @Transactional(readOnly = true)
    public Contacto buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el requerimiento con id " + id + "."));
    }

    // UPDATE: reemplaza los datos de un requerimiento existente.
    @Transactional
    public Contacto actualizar(Long id, ContactoRequest datos) {
        Contacto contacto = buscarPorId(id);
        copiarDatos(datos, contacto);
        return repository.save(contacto);
    }

    // UPDATE: cambia solo el estado (por ejemplo, de PENDIENTE a ATENDIDO).
    @Transactional
    public Contacto cambiarEstado(Long id, String estado) {
        Contacto contacto = buscarPorId(id);
        contacto.setEstado(estado);
        return repository.save(contacto);
    }

    // DELETE: elimina un requerimiento. Si no existe, responde 404.
    @Transactional
    public void eliminar(Long id) {
        Contacto contacto = buscarPorId(id);
        repository.delete(contacto);
    }

    // Copia los datos recibidos a la entidad, quitando espacios sobrantes.
    private void copiarDatos(ContactoRequest datos, Contacto contacto) {
        contacto.setNombreCompleto(datos.nombreCompleto().trim());
        contacto.setCorreo(datos.correo().trim().toLowerCase());
        String telefono = datos.telefono() == null ? "" : datos.telefono().trim();
        contacto.setTelefono(telefono.isEmpty() ? null : telefono);
        contacto.setMensaje(datos.mensaje().trim());
    }
}
