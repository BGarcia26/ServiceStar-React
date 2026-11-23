import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Rol } from '../interfaces';
import { useSesion } from '../contexto/useSesion';
import Boton from '../componentes/atomos/Boton';

interface RutaProtegidaProps {
  roles: Rol[];       // roles que pueden ver la página
  children: ReactNode;
}

// Envuelve una página para que solo la vean usuarios autenticados con el rol indicado.
// La protección real está en el backend; esto evita mostrar pantallas que no corresponden.
function RutaProtegida({ roles, children }: RutaProtegidaProps) {
  const { usuario, cargando } = useSesion();
  const location = useLocation();

  // Mientras se valida la sesión guardada no se redirige (evita "parpadeos" al recargar).
  if (cargando) {
    return (
      <main className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando sesión...</span>
        </div>
      </main>
    );
  }

  // Sin sesión: va al login y recuerda a qué página quería entrar.
  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  // Con sesión pero sin el rol necesario.
  if (!roles.includes(usuario.rol)) {
    return (
      <main className="container py-5 text-center">
        <h2 className="text-white mb-3">Acceso denegado</h2>
        <p className="text-secondary mb-4">Tu cuenta no tiene permiso para ver esta página.</p>
        <Boton texto="Volver al inicio" to="/" />
      </main>
    );
  }

  return children;
}

export default RutaProtegida;
