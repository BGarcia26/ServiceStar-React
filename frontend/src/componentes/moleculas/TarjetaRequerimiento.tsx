import type { ReactNode } from 'react';
import type { Requerimiento } from '../../interfaces';
import Etiqueta from '../atomos/Etiqueta';

interface TarjetaRequerimientoProps {
  requerimiento: Requerimiento;
  children?: ReactNode; // botones de acción (solo en el panel de administración)
}

const formatoFecha = new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' });

// Muestra un requerimiento guardado en la base de datos.
function TarjetaRequerimiento({ requerimiento, children }: TarjetaRequerimientoProps) {
  const atendido = requerimiento.estado === 'ATENDIDO';

  return (
    <div className="card tarjeta h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h3 className="card-title h6 mb-0">{requerimiento.nombreCompleto}</h3>
          <Etiqueta texto={atendido ? 'Atendido' : 'Pendiente'} color={atendido ? 'success' : 'warning'} />
        </div>
        <p className="small text-secondary mb-2">
          #{requerimiento.id} · {formatoFecha.format(new Date(requerimiento.fechaCreacion))}
        </p>
        <p className="small mb-1">✉️ {requerimiento.correo}</p>
        {requerimiento.telefono && <p className="small mb-1">📞 {requerimiento.telefono}</p>}
        <p className="mensaje-requerimiento mt-2 mb-3 flex-grow-1">{requerimiento.mensaje}</p>
        {children && <div className="d-flex flex-wrap gap-2">{children}</div>}
      </div>
    </div>
  );
}

export default TarjetaRequerimiento;
