import { useParams } from 'react-router-dom';
import Boton from '../componentes/atomos/Boton';
import Etiqueta from '../componentes/atomos/Etiqueta';
import { productos } from '../data/productos';

function DetalleProducto() {
  // Se obtiene el id desde la URL: /tienda/:id
  const { id } = useParams();
  const producto = productos.find((p) => p.id === Number(id));

  if (!producto) {
    return (
      <main className="container py-5 text-center">
        <h2 className="text-white mb-4">Producto no encontrado</h2>
        <Boton texto="Volver a la tienda" to="/tienda" />
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="card tarjeta p-4">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-5">
            <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded img-detalle w-100" />
          </div>
          <div className="col-12 col-md-7">
            <Etiqueta texto={producto.etiqueta} />
            <h1 className="h2 text-white mt-3">{producto.nombre}</h1>
            <p className="text-secondary">{producto.descripcion}</p>
            <ul className="list-unstyled">
              <li><strong>Categoría:</strong> {producto.categoria}</li>
              <li><strong>Marca:</strong> {producto.marca}</li>
              <li><strong>Código:</strong> {producto.id}</li>
            </ul>
            <div className="d-flex flex-wrap gap-3 mt-4">
              <Boton texto="Volver a la tienda" to="/tienda" variante="secundario" />
              <Boton texto="Cotizar este equipo" to="/#contacto" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DetalleProducto;
