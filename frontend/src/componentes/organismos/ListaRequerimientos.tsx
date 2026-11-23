import type { ReactNode } from 'react';
import type { Requerimiento } from '../../interfaces';
import TarjetaRequerimiento from '../moleculas/TarjetaRequerimiento';

interface ListaRequerimientosProps {
  requerimientos: Requerimiento[];
  mensajeVacio: string;
  acciones?: (requerimiento: Requerimiento) => ReactNode; // botones para cada tarjeta
}

// Grilla responsiva de requerimientos: 1 columna en celular, 2 desde notebook.
function ListaRequerimientos({ requerimientos, mensajeVacio, acciones }: ListaRequerimientosProps) {
  if (requerimientos.length === 0) {
    return <p className="text-secondary text-center py-5 mb-0">{mensajeVacio}</p>;
  }

  return (
    <div className="row row-cols-1 row-cols-lg-2 g-4">
      {requerimientos.map((requerimiento) => (
        <div key={requerimiento.id} className="col">
          <TarjetaRequerimiento requerimiento={requerimiento}>
            {acciones?.(requerimiento)}
          </TarjetaRequerimiento>
        </div>
      ))}
    </div>
  );
}

export default ListaRequerimientos;
