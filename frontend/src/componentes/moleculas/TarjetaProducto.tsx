import type { Producto } from '../../interfaces';
import Boton from '../atomos/Boton';
import Etiqueta from '../atomos/Etiqueta';

interface TarjetaProductoProps {
  producto: Producto;
}

function TarjetaProducto({ producto }: TarjetaProductoProps) {
  return (
    <div className="card tarjeta h-100">
      <img src={producto.imagen} alt={producto.nombre} className="card-img-top img-producto" />
      <div className="card-body d-flex flex-column text-center">
        <h4 className="card-title h6 text-uppercase">{producto.nombre}</h4>
        <p className="small text-secondary mb-2">
          {producto.categoria} · {producto.marca}
        </p>
        <div className="mb-3">
          <Etiqueta texto={producto.etiqueta} />
        </div>
        <div className="mt-auto">
          <Boton texto="Ver detalle" to={`/tienda/${producto.id}`} />
        </div>
      </div>
    </div>
  );
}

export default TarjetaProducto;
