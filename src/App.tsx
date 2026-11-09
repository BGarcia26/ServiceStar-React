import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import BarraNavegacion from './componentes/organismos/BarraNavegacion';
import PiePagina from './componentes/organismos/PiePagina';
import Inicio from './paginas/Inicio';
import Servicios from './paginas/Servicios';
import Equipos from './paginas/Equipos';
import Tienda from './paginas/Tienda';
import DetalleProducto from './paginas/DetalleProducto';

function App() {
  const { pathname } = useLocation();

  // Al cambiar de página se vuelve al inicio de la pantalla
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <BarraNavegacion />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/tienda/:id" element={<DetalleProducto />} />
        </Routes>
      </div>
      <PiePagina />
    </div>
  );
}

export default App;
