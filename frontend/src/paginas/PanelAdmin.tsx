import { useCallback, useEffect, useState } from 'react';
import type { DatosContacto, EstadoRequerimiento, Requerimiento } from '../interfaces';
import { useSesion } from '../contexto/useSesion';
import { ErrorApi } from '../servicios/api';
import {
  actualizarRequerimiento, cambiarEstadoRequerimiento, eliminarRequerimiento, erroresDeContacto, listarRequerimientos,
} from '../servicios/requerimientos';
import ListaRequerimientos from '../componentes/organismos/ListaRequerimientos';
import ModalEditarRequerimiento from '../componentes/organismos/ModalEditarRequerimiento';
import ModalConfirmacion from '../componentes/moleculas/ModalConfirmacion';
import Boton from '../componentes/atomos/Boton';

type Filtro = 'TODOS' | EstadoRequerimiento;

const filtros: { valor: Filtro; texto: string }[] = [
  { valor: 'TODOS', texto: 'Todos' },
  { valor: 'PENDIENTE', texto: 'Pendientes' },
  { valor: 'ATENDIDO', texto: 'Atendidos' },
];

// Página del rol ADMIN: lectura, actualización y eliminación de requerimientos.
function PanelAdmin() {
  const { sesion } = useSesion();
  const token = sesion?.token ?? '';

  const [requerimientos, setRequerimientos] = useState<Requerimiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('TODOS');
  const [editando, setEditando] = useState<Requerimiento | null>(null);
  const [eliminando, setEliminando] = useState<Requerimiento | null>(null);
  const [procesando, setProcesando] = useState(false);

  // READ: GET /api/contactos
  const pedirLista = useCallback(() => {
    listarRequerimientos(token)
      .then(setRequerimientos)
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));
  }, [token]);

  // Se consulta la API al abrir la página...
  useEffect(() => {
    pedirLista();
  }, [pedirLista]);

  // ...y cuando se presiona "Actualizar".
  const recargar = () => {
    setCargando(true);
    setError('');
    pedirLista();
  };

  // Reemplaza en la lista el registro que devolvió la API (sin volver a pedir todo)
  const reemplazar = (actualizado: Requerimiento) =>
    setRequerimientos((lista) => lista.map((r) => (r.id === actualizado.id ? actualizado : r)));

  // UPDATE: PUT /api/contactos/{id}/estado
  const alternarEstado = async (requerimiento: Requerimiento) => {
    const nuevoEstado: EstadoRequerimiento = requerimiento.estado === 'PENDIENTE' ? 'ATENDIDO' : 'PENDIENTE';
    try {
      reemplazar(await cambiarEstadoRequerimiento(requerimiento.id, nuevoEstado, token));
      setAviso(`El requerimiento #${requerimiento.id} quedó ${nuevoEstado === 'ATENDIDO' ? 'atendido' : 'pendiente'}.`);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  // UPDATE: PUT /api/contactos/{id}. Devuelve errores por campo si el backend los rechaza.
  const guardarEdicion = async (datos: DatosContacto) => {
    if (!editando) return null;
    try {
      reemplazar(await actualizarRequerimiento(editando.id, datos, token));
      setAviso(`Se guardaron los cambios del requerimiento #${editando.id}.`);
      setEditando(null);
      return null;
    } catch (e) {
      if (e instanceof ErrorApi && e.status === 400) return erroresDeContacto(e);
      setError((e as Error).message);
      setEditando(null);
      return null;
    }
  };

  // DELETE: DELETE /api/contactos/{id}
  const confirmarEliminacion = async () => {
    if (!eliminando) return;
    setProcesando(true);
    try {
      await eliminarRequerimiento(eliminando.id, token);
      setRequerimientos((lista) => lista.filter((r) => r.id !== eliminando.id));
      setAviso(`Se eliminó el requerimiento #${eliminando.id}.`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProcesando(false);
      setEliminando(null);
    }
  };

  const pendientes = requerimientos.filter((r) => r.estado === 'PENDIENTE').length;
  const visibles = filtro === 'TODOS' ? requerimientos : requerimientos.filter((r) => r.estado === filtro);

  return (
    <main className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 text-white mb-1">Panel de requerimientos</h1>
          <p className="text-secondary mb-0">
            {requerimientos.length} en total · {pendientes} pendientes · {requerimientos.length - pendientes} atendidos
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <div className="btn-group" role="group" aria-label="Filtrar por estado">
            {filtros.map((f) => (
              <button key={f.valor} type="button"
                className={`btn btn-sm ${filtro === f.valor ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFiltro(f.valor)}>
                {f.texto}
              </button>
            ))}
          </div>
          <Boton texto="Actualizar" variante="secundario" pequeno onClick={recargar} />
        </div>
      </div>

      {aviso && (
        <div className="alert alert-success alert-dismissible" role="status">
          {aviso}
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setAviso('')}></button>
        </div>
      )}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {cargando ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
      ) : (
        <ListaRequerimientos
          requerimientos={visibles}
          mensajeVacio="No hay requerimientos para mostrar."
          acciones={(r) => (
            <>
              <Boton pequeno variante="exito" texto={r.estado === 'PENDIENTE' ? 'Marcar atendido' : 'Marcar pendiente'}
                onClick={() => alternarEstado(r)} />
              <Boton pequeno variante="secundario" texto="Editar" onClick={() => setEditando(r)} />
              <Boton pequeno variante="peligro" texto="Eliminar" onClick={() => setEliminando(r)} />
            </>
          )}
        />
      )}

      {editando && (
        <ModalEditarRequerimiento requerimiento={editando} onGuardar={guardarEdicion} onCerrar={() => setEditando(null)} />
      )}
      {eliminando && (
        <ModalConfirmacion
          titulo="Eliminar requerimiento"
          mensaje={`¿Seguro que quieres eliminar el requerimiento #${eliminando.id} de ${eliminando.nombreCompleto}? Esta acción no se puede deshacer.`}
          textoConfirmar="Eliminar"
          procesando={procesando}
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setEliminando(null)}
        />
      )}
    </main>
  );
}

export default PanelAdmin;
