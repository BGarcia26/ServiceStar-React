import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { DatosLogin, DatosRegistro, Sesion } from '../interfaces';
import { SesionContexto } from './SesionContexto';
import { iniciarSesionApi, obtenerPerfil, registrarseApi } from '../servicios/autenticacion';
import { ErrorApi, EVENTO_SESION_EXPIRADA } from '../servicios/api';

// Clave con la que se guarda la sesión en el navegador.
const CLAVE_SESION = 'servicestar.sesion';

const estaVigente = (sesion: Sesion) => new Date(sesion.expiraEn).getTime() > Date.now();

// Lee la sesión guardada. Si no existe, está dañada o ya expiró, la descarta.
function leerSesionGuardada(): Sesion | null {
  try {
    const texto = localStorage.getItem(CLAVE_SESION);
    if (!texto) return null;
    const sesion = JSON.parse(texto) as Sesion;
    if (sesion.token && sesion.usuario && estaVigente(sesion)) return sesion;
  } catch {
    // Si el contenido no es JSON válido se ignora.
  }
  localStorage.removeItem(CLAVE_SESION);
  return null;
}

interface ProveedorSesionProps {
  children: ReactNode;
}

// Mantiene el estado de autenticación para toda la aplicación y lo
// conserva en localStorage para que la sesión sobreviva a recargar la página.
function ProveedorSesion({ children }: ProveedorSesionProps) {
  const [sesion, setSesion] = useState<Sesion | null>(leerSesionGuardada);
  // Si había una sesión guardada, hay que confirmarla con el backend antes de usarla.
  const [cargando, setCargando] = useState(sesion !== null);
  const [sesionExpirada, setSesionExpirada] = useState(false);
  const tokenInicial = useRef(sesion?.token);

  const guardarSesion = useCallback((nueva: Sesion) => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(nueva));
    setSesionExpirada(false);
    setSesion(nueva);
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(CLAVE_SESION);
    setSesion(null);
  }, []);

  const expirarSesion = useCallback(() => {
    cerrarSesion();
    setSesionExpirada(true);
  }, [cerrarSesion]);

  // 1) Al recargar: pregunta al backend si el token guardado sigue siendo válido
  //    y trae los datos actualizados del usuario (por ejemplo, si cambió su rol).
  useEffect(() => {
    const token = tokenInicial.current;
    if (!token) return;
    obtenerPerfil(token)
      .then((usuario) => setSesion((actual) => (actual ? { ...actual, usuario } : actual)))
      .catch((error) => {
        // Sin conexión se mantiene la sesión; si el backend la rechaza, se cierra.
        if (error instanceof ErrorApi && error.status !== 0) expirarSesion();
      })
      .finally(() => setCargando(false));
  }, [expirarSesion]);

  // 2) Cierra la sesión automáticamente cuando el token llega a su hora de expiración.
  useEffect(() => {
    if (!sesion) return;
    const restante = new Date(sesion.expiraEn).getTime() - Date.now();
    const temporizador = window.setTimeout(expirarSesion, Math.max(restante, 0));
    return () => window.clearTimeout(temporizador);
  }, [sesion, expirarSesion]);

  // 3) Si cualquier petición recibe 401 con token, la sesión se cierra.
  //    Y si se inicia o cierra sesión en otra pestaña, esta se sincroniza.
  useEffect(() => {
    const alCambiarEnOtraPestana = (evento: StorageEvent) => {
      if (evento.key === CLAVE_SESION) setSesion(leerSesionGuardada());
    };
    window.addEventListener(EVENTO_SESION_EXPIRADA, expirarSesion);
    window.addEventListener('storage', alCambiarEnOtraPestana);
    return () => {
      window.removeEventListener(EVENTO_SESION_EXPIRADA, expirarSesion);
      window.removeEventListener('storage', alCambiarEnOtraPestana);
    };
  }, [expirarSesion]);

  const iniciarSesion = useCallback(async (datos: DatosLogin) => {
    const nueva = await iniciarSesionApi(datos);
    guardarSesion(nueva);
    return nueva.usuario;
  }, [guardarSesion]);

  const registrarse = useCallback(async (datos: DatosRegistro) => {
    const nueva = await registrarseApi(datos);
    guardarSesion(nueva);
    return nueva.usuario;
  }, [guardarSesion]);

  const valor = useMemo(() => ({
    sesion,
    usuario: sesion?.usuario ?? null,
    cargando,
    sesionExpirada,
    iniciarSesion,
    registrarse,
    cerrarSesion,
  }), [sesion, cargando, sesionExpirada, iniciarSesion, registrarse, cerrarSesion]);

  return <SesionContexto.Provider value={valor}>{children}</SesionContexto.Provider>;
}

export default ProveedorSesion;
