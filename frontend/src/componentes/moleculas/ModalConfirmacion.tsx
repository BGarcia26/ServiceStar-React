import Boton from '../atomos/Boton';

interface ModalConfirmacionProps {
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
  procesando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

// Ventana de confirmación con los estilos de Bootstrap.
// Se muestra u oculta con estado de React (sin el JavaScript de Bootstrap).
function ModalConfirmacion({ titulo, mensaje, textoConfirmar, procesando = false, onConfirmar, onCancelar }: ModalConfirmacionProps) {
  return (
    <>
      <div className="modal d-block" role="dialog" aria-modal="true" aria-labelledby="titulo-confirmacion">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="titulo-confirmacion" className="modal-title h5">{titulo}</h2>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCancelar}></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">{mensaje}</p>
            </div>
            <div className="modal-footer">
              <Boton texto="Cancelar" variante="secundario" onClick={onCancelar} deshabilitado={procesando} />
              <Boton texto={procesando ? 'Procesando...' : textoConfirmar} variante="peligro" onClick={onConfirmar} deshabilitado={procesando} />
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}

export default ModalConfirmacion;
