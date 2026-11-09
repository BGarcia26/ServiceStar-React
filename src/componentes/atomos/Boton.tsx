import { Link } from 'react-router-dom';

interface BotonProps {
  texto: string;
  to?: string; // ruta interna (React Router)
  href?: string; // ancla dentro de la misma página
  type?: 'button' | 'submit';
  variante?: 'primario' | 'secundario';
  bloque?: boolean;
}

function Boton({ texto, to, href, type = 'button', variante = 'primario', bloque = false }: BotonProps) {
  const clases = `btn ${variante === 'primario' ? 'btn-primary' : 'btn-outline-primary'} fw-semibold px-4 ${bloque ? 'w-100' : ''}`;

  if (to) {
    return <Link to={to} className={clases}>{texto}</Link>;
  }
  if (href) {
    return <a href={href} className={clases}>{texto}</a>;
  }
  return <button type={type} className={clases}>{texto}</button>;
}

export default Boton;
