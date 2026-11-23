import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { DatosContacto, ErroresContacto, Requerimiento } from '../../interfaces';
import { validarContacto } from '../../utils/validaciones';
import { aDatosContacto } from '../../servicios/requerimientos';
import CampoFormulario from '../moleculas/CampoFormulario';
import Boton from '../atomos/Boton';

interface ModalEditarRequerimientoProps {
  requerimiento: Requerimiento;
  // Lo ejecuta el panel: llama a la API y devuelve errores por campo si el backend los rechaza.
  onGuardar: (datos: DatosContacto) => Promise<ErroresContacto | null>;
  onCerrar: () => void;
}

// Formulario para editar un requerimiento (operación UPDATE del CRUD).
function ModalEditarRequerimiento({ requerimiento, onGuardar, onCerrar }: ModalEditarRequerimientoProps) {
  const [datos, setDatos] = useState<DatosContacto>(() => aDatosContacto(requerimiento));
  const [errores, setErrores] = useState<ErroresContacto>({});
  const [guardando, setGuardando] = useState(false);

  const manejarCambio = (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  };

  const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const nuevosErrores = validarContacto(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setGuardando(true);
    const erroresApi = await onGuardar(datos);
    setGuardando(false);
    if (erroresApi) setErrores(erroresApi);
  };

  return (
    <>
      <div className="modal d-block" role="dialog" aria-modal="true" aria-labelledby="titulo-editar">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <form className="modal-content" noValidate onSubmit={manejarEnvio}>
            <div className="modal-header">
              <h2 id="titulo-editar" className="modal-title h5">Editar requerimiento #{requerimiento.id}</h2>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
            </div>
            <div className="modal-body">
              <CampoFormulario id="editar-nombre" nombre="nombre" etiqueta="Nombre o Empresa:" valor={datos.nombre}
                onChange={manejarCambio} error={errores.nombre} />
              <CampoFormulario id="editar-correo" nombre="correo" etiqueta="Correo:" tipo="email" valor={datos.correo}
                onChange={manejarCambio} error={errores.correo} />
              <CampoFormulario id="editar-telefono" nombre="telefono" etiqueta="Teléfono:" tipo="tel" valor={datos.telefono}
                onChange={manejarCambio} error={errores.telefono} />
              <CampoFormulario id="editar-mensaje" nombre="mensaje" etiqueta="Requerimiento:" tipo="textarea" valor={datos.mensaje}
                onChange={manejarCambio} error={errores.mensaje} />
            </div>
            <div className="modal-footer">
              <Boton texto="Cancelar" variante="secundario" onClick={onCerrar} deshabilitado={guardando} />
              <Boton texto={guardando ? 'Guardando...' : 'Guardar cambios'} type="submit" deshabilitado={guardando} />
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}

export default ModalEditarRequerimiento;
