import type { DatosLogin, DatosRegistro, Sesion, Usuario } from '../interfaces';
import { peticion } from './api';

// Endpoints de /api/auth.

// POST: valida correo y contraseña; la API responde con el token JWT.
export const iniciarSesionApi = (datos: DatosLogin) =>
  peticion<Sesion>('/api/auth/login', {
    metodo: 'POST',
    cuerpo: { correo: datos.correo.trim(), password: datos.password },
  });

// POST: crea una cuenta CLIENTE y responde con el token JWT.
export const registrarseApi = (datos: DatosRegistro) =>
  peticion<Sesion>('/api/auth/registro', {
    metodo: 'POST',
    cuerpo: { nombre: datos.nombre.trim(), correo: datos.correo.trim(), password: datos.password },
  });

// GET: datos del dueño del token. Sirve para comprobar que la sesión sigue válida.
export const obtenerPerfil = (token: string) => peticion<Usuario>('/api/auth/perfil', { token });
