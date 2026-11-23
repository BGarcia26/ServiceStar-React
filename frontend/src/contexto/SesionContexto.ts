import { createContext } from 'react';
import type { DatosLogin, DatosRegistro, Sesion, Usuario } from '../interfaces';

// Lo que cualquier componente puede leer o hacer con la sesión.
export interface ValorSesion {
  sesion: Sesion | null;
  usuario: Usuario | null;
  cargando: boolean;          // true mientras se valida la sesión guardada al recargar
  sesionExpirada: boolean;    // true si la sesión se cerró porque venció el token
  iniciarSesion: (datos: DatosLogin) => Promise<Usuario>;
  registrarse: (datos: DatosRegistro) => Promise<Usuario>;
  cerrarSesion: () => void;
}

// Contexto global de la sesión. Lo llena ProveedorSesion y se lee con useSesion().
export const SesionContexto = createContext<ValorSesion | null>(null);
