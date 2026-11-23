import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavItem from '../atomos/NavItem';
import { useSesion } from '../../contexto/useSesion';

const enlaces = [
  { to: '/', texto: 'Inicio' },
  { to: '/servicios', texto: 'Servicios TIC' },
  { to: '/equipos', texto: 'Equipos y Licencias' },
  { to: '/tienda', texto: 'Tienda de Equipos' },
];

function BarraNavegacion() {
  // Estado que controla si el menú está abierto en pantallas pequeñas
  const [abierto, setAbierto] = useState(false);
  const { usuario, cerrarSesion } = useSesion();
  const navigate = useNavigate();
  const cerrarMenu = () => setAbierto(false);

  // Al salir primero se va al inicio y la sesión se cierra cuando la ruta ya cambió;
  // así una página protegida no alcanza a redirigir al login.
  const { pathname } = useLocation();
  const saliendo = useRef(false);

  useEffect(() => {
    if (saliendo.current && pathname === '/') {
      saliendo.current = false;
      cerrarSesion();
    }
  }, [pathname, cerrarSesion]);

  const salir = () => {
    cerrarMenu();
    if (pathname === '/') {
      cerrarSesion();
      return;
    }
    saliendo.current = true;
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top barra">
      <div className="container">
        <Link to="/" className="navbar-brand logo" onClick={cerrarMenu}>
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
          <ul className="navbar-nav ms-auto gap-lg-3 align-items-lg-center">
            {enlaces.map((enlace) => (
              <NavItem key={enlace.to} to={enlace.to} texto={enlace.texto} onClick={cerrarMenu} />
            ))}

            {/* Lo que se muestra depende del estado de la sesión y del rol */}
            {usuario?.rol === 'ADMIN' && <NavItem to="/admin" texto="Panel admin" onClick={cerrarMenu} />}
            {usuario?.rol === 'CLIENTE' && <NavItem to="/mis-requerimientos" texto="Mis requerimientos" onClick={cerrarMenu} />}

            {usuario ? (
              <li className="nav-item d-flex align-items-center gap-2 py-2 py-lg-0">
                <span className="small text-secondary">{usuario.nombre}</span>
                <button type="button" className="btn btn-sm btn-outline-light" onClick={salir}>Salir</button>
              </li>
            ) : (
              <NavItem to="/login" texto="Ingresar" onClick={cerrarMenu} />
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default BarraNavegacion;
