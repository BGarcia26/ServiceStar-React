import type { Producto } from '../../interfaces';
import TarjetaProducto from '../moleculas/TarjetaProducto';

interface GrillaProductosProps {
  productos: Producto[];
}

function GrillaProductos({ productos }: GrillaProductosProps) {
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
      {productos.map((producto) => (
        <div key={producto.id} className="col">
          <TarjetaProducto producto={producto} />
        </div>
      ))}
    </div>
  );
}

export default GrillaProductos;
