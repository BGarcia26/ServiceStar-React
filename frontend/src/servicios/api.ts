// Punto único de comunicación con la API REST de Spring Boot.
// Todas las peticiones pasan por aquí: así el header del token, el manejo
// de errores y la URL base se escriben una sola vez.

// URL del backend. Se puede cambiar con la variable VITE_API_URL (archivo .env).
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8082';

// Evento que se dispara cuando el backend rechaza el token (expiró o es inválido).
export const EVENTO_SESION_EXPIRADA = 'servicestar:sesion-expirada';

// Error con el código HTTP y, si existen, los errores por campo que envía la API.
export class ErrorApi extends Error {
  status: number;
  errores: Record<string, string>;

  constructor(status: number, mensaje: string, errores: Record<string, string> = {}) {
    super(mensaje);
    this.status = status;
    this.errores = errores;
  }
}

interface OpcionesPeticion {
  metodo?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  cuerpo?: unknown;
  token?: string;
}

const mensajesPorEstado: Record<number, string> = {
  401: 'Tu sesión expiró. Vuelve a iniciar sesión.',
  403: 'No tienes permiso para realizar esta acción.',
  404: 'El registro solicitado no existe.',
};

export async function peticion<T>(ruta: string, { metodo = 'GET', cuerpo, token }: OpcionesPeticion = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (cuerpo !== undefined) headers['Content-Type'] = 'application/json';
  // Las rutas protegidas exigen el token JWT en este header.
  if (token) headers.Authorization = `Bearer ${token}`;

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    // fetch solo falla así cuando no hay conexión con el servidor.
    throw new ErrorApi(0, 'No se pudo conectar con el servidor. Revisa que la API esté encendida.');
  }

  // Si se envió un token y el backend responde 401, la sesión ya no es válida.
  if (respuesta.status === 401 && token) {
    window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
  }

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => null);
    throw new ErrorApi(
      respuesta.status,
      error?.mensaje ?? mensajesPorEstado[respuesta.status] ?? 'Ocurrió un error inesperado.',
      error?.errores ?? {},
    );
  }

  // 204 No Content (por ejemplo, al eliminar) no trae cuerpo.
  if (respuesta.status === 204) return undefined as T;
  return respuesta.json() as Promise<T>;
}
