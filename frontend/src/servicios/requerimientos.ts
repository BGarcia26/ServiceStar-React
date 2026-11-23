import type { DatosContacto, ErroresContacto, EstadoRequerimiento, Requerimiento } from '../interfaces';
import { ErrorApi, peticion } from './api';

// Endpoints de /api/contactos (CRUD de requerimientos).

// El formulario usa "nombre"; la API espera "nombreCompleto".
const aCuerpo = (datos: DatosContacto) => ({
  nombreCompleto: datos.nombre.trim(),
  correo: datos.correo.trim(),
  telefono: datos.telefono.trim(),
  mensaje: datos.mensaje.trim(),
});

// POST (público): guarda un requerimiento nuevo.
export const crearRequerimiento = (datos: DatosContacto) =>
  peticion<Requerimiento>('/api/contactos', { metodo: 'POST', cuerpo: aCuerpo(datos) });

// GET (ADMIN): todos los requerimientos.
export const listarRequerimientos = (token: string) =>
  peticion<Requerimiento[]>('/api/contactos', { token });

// GET (CLIENTE o ADMIN): solo los del usuario que inició sesión.
export const listarMisRequerimientos = (token: string) =>
  peticion<Requerimiento[]>('/api/contactos/mios', { token });

// PUT (ADMIN): reemplaza los datos de un requerimiento.
export const actualizarRequerimiento = (id: number, datos: DatosContacto, token: string) =>
  peticion<Requerimiento>(`/api/contactos/${id}`, { metodo: 'PUT', cuerpo: aCuerpo(datos), token });

// PUT (ADMIN): cambia el estado a PENDIENTE o ATENDIDO.
export const cambiarEstadoRequerimiento = (id: number, estado: EstadoRequerimiento, token: string) =>
  peticion<Requerimiento>(`/api/contactos/${id}/estado`, { metodo: 'PUT', cuerpo: { estado }, token });

// DELETE (ADMIN): elimina un requerimiento.
export const eliminarRequerimiento = (id: number, token: string) =>
  peticion<void>(`/api/contactos/${id}`, { metodo: 'DELETE', token });

// Convierte los errores por campo de la API al formato del formulario.
export function erroresDeContacto(error: ErrorApi): ErroresContacto {
  const { nombreCompleto, correo, telefono, mensaje } = error.errores;
  return Object.fromEntries(
    Object.entries({ nombre: nombreCompleto, correo, telefono, mensaje }).filter(([, valor]) => valor),
  );
}

// Pasa un requerimiento al formato del formulario (para editarlo).
export const aDatosContacto = (requerimiento: Requerimiento): DatosContacto => ({
  nombre: requerimiento.nombreCompleto,
  correo: requerimiento.correo,
  telefono: requerimiento.telefono ?? '',
  mensaje: requerimiento.mensaje,
});
