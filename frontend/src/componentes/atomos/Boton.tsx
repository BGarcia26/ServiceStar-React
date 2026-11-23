import { Link } from 'react-router-dom';

interface BotonProps {
  texto: string;
  to?: string; // ruta interna (React Router)
  href?: string; // ancla dentro de la misma página
  type?: 'button' | 'submit';
  variante?: 'primario' | 'secundario' | 'exito' | 'peligro';
  bloque?: boolean;
  pequeno?: boolean;
  deshabilitado?: boolean;
  onClick?: () => void;
}

const clasesVariante = {
  primario: 'btn-primary',
  secundario: 'btn-outline-primary',
  exito: 'btn-outline-success',
  peligro: 'btn-outline-danger',
};

function Boton({
  texto, to, href, type = 'button', variante = 'primario', bloque = false, pequeno = false, deshabilitado = false, onClick,
}: BotonProps) {
  const clases = `btn ${clasesVariante[variante]} fw-semibold ${pequeno ? 'btn-sm px-3' : 'px-4'} ${bloque ? 'w-100' : ''}`;

  if (to) {
    return <Link to={to} className={clases} onClick={onClick}>{texto}</Link>;
  }
  if (href) {
    return <a href={href} className={clases}>{texto}</a>;
  }
  return <button type={type} className={clases} disabled={deshabilitado} onClick={onClick}>{texto}</button>;
}

export default Boton;
