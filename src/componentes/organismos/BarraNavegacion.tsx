import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavItem from '../atomos/NavItem';

const enlaces = [
  { to: '/', texto: 'Inicio' },
  { to: '/servicios', texto: 'Servicios TIC' },
  { to: '/equipos', texto: 'Equipos y Licencias' },
  { to: '/tienda', texto: 'Tienda de Equipos' },
];

function BarraNavegacion() {
  // Estado que controla si el menú está abierto en pantallas pequeñas
  const [abierto, setAbierto] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg sticky-top barra">
      <div className="container">
        <Link to="/" className="navbar-brand logo" onClick={() => setAbierto(false)}>
          ⭐ Service Star
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          onClick={() => setAbierto(!abierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${abierto ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto gap-lg-3">
            {enlaces.map((enlace) => (
              <NavItem key={enlace.to} to={enlace.to} texto={enlace.texto} onClick={() => setAbierto(false)} />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default BarraNavegacion;
