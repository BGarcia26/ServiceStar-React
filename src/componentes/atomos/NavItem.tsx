import { NavLink } from 'react-router-dom';

interface NavItemProps {
  to: string;
  texto: string;
  onClick?: () => void;
}

// NavLink agrega automáticamente la clase "active" cuando la ruta coincide
function NavItem({ to, texto, onClick }: NavItemProps) {
  return (
    <li className="nav-item">
      <NavLink to={to} end={to === '/'} className="nav-link" onClick={onClick}>
        {texto}
      </NavLink>
    </li>
  );
}

export default NavItem;
