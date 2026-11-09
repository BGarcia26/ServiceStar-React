import type { DatosContacto, ErroresContacto } from '../interfaces';

const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTelefono = /^\+?[0-9\s]{8,15}$/;

// Devuelve un objeto con los errores encontrados (vacío si todo es válido)
export function validarContacto(datos: DatosContacto): ErroresContacto {
  const errores: ErroresContacto = {};

  if (datos.nombre.trim().length < 3) {
    errores.nombre = 'Por favor, ingresa un nombre válido (mínimo 3 caracteres).';
  }

  if (!regexCorreo.test(datos.correo.trim())) {
    errores.correo = 'Ingresa un correo válido. Sugerencia: usuario@empresa.cl';
  }

  // El teléfono es opcional: solo se valida si el usuario escribió algo
  if (datos.telefono.trim() !== '' && !regexTelefono.test(datos.telefono.trim())) {
    errores.telefono = 'Formato inválido. Sugerencia: +56 9 1234 5678';
  }

  if (datos.mensaje.trim().length < 10) {
    errores.mensaje = 'Detalla un poco más tu requerimiento (mínimo 10 caracteres).';
  }

  return errores;
}
