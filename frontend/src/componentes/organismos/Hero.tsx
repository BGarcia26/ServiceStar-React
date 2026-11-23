import type { ReactNode } from 'react';

interface HeroProps {
  titulo: string;
  texto: string;
  imagen: string;
  compacto?: boolean;
  children?: ReactNode;
}

function Hero({ titulo, texto, imagen, compacto = false, children }: HeroProps) {
  return (
    <header
      className={`hero d-flex align-items-center justify-content-center text-center px-3 ${compacto ? 'hero-compacto' : ''}`}
      style={{ backgroundImage: `linear-gradient(rgba(11, 17, 32, 0.8), rgba(11, 17, 32, 0.95)), url('${imagen}')` }}
    >
      <div>
        <h1 className="display-5 fw-bold text-white mb-3">{titulo}</h1>
        <p className="lead text-secondary mx-auto mb-4">{texto}</p>
        {children}
      </div>
    </header>
  );
}

export default Hero;
