import { useEffect, useState } from 'react';
import type { Requerimiento } from '../interfaces';
import { useSesion } from '../contexto/useSesion';
import { listarMisRequerimientos } from '../servicios/requerimientos';
import ListaRequerimientos from '../componentes/organismos/ListaRequerimientos';
import Boton from '../componentes/atomos/Boton';

// Página del rol CLIENTE: muestra solo sus requerimientos y en qué estado están.
function MisRequerimientos() {
  const { sesion, usuario } = useSesion();
  const token = sesion?.token;
  const [requerimientos, setRequerimientos] = useState<Requerimiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // GET /api/contactos/mios al abrir la página
  useEffect(() => {
    if (!token) return;
    listarMisRequerimientos(token)
      .then(setRequerimientos)
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));
  }, [token]);

  return (
    <main className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 text-white mb-1">Mis requerimientos</h1>
          <p className="text-secondary mb-0">Requerimientos enviados con el correo {usuario?.correo}.</p>
        </div>
        <Boton texto="Nuevo requerimiento" to="/#contacto" />
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {cargando ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
      ) : (
        <ListaRequerimientos requerimientos={requerimientos}
          mensajeVacio="Todavía no has enviado requerimientos. Usa el formulario de contacto para enviar el primero." />
      )}
    </main>
  );
}

export default MisRequerimientos;
