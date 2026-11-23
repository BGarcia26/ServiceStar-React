interface EtiquetaProps {
  texto: string;
  color?: 'primary' | 'success' | 'warning' | 'secondary';
}

function Etiqueta({ texto, color = 'primary' }: EtiquetaProps) {
  return <span className={`badge rounded-pill text-bg-${color}`}>{texto}</span>;
}

export default Etiqueta;
