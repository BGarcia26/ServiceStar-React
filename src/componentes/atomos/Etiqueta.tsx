interface EtiquetaProps {
  texto: string;
}

function Etiqueta({ texto }: EtiquetaProps) {
  return <span className="badge rounded-pill text-bg-primary">{texto}</span>;
}

export default Etiqueta;
