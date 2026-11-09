import Boton from '../atomos/Boton';

interface TarjetaInfoProps {
  titulo: string;
  descripcion: string;
  textoBoton?: string;
  rutaBoton?: string;
}

function TarjetaInfo({ titulo, descripcion, textoBoton, rutaBoton }: TarjetaInfoProps) {
  return (
    <div className="card tarjeta h-100 p-3">
      <div className="card-body d-flex flex-column">
        <h3 className="card-title h5">{titulo}</h3>
        <p className="card-text text-secondary flex-grow-1">{descripcion}</p>
        {textoBoton && rutaBoton && (
          <div>
            <Boton texto={textoBoton} to={rutaBoton} variante="secundario" />
          </div>
        )}
      </div>
    </div>
  );
}

export default TarjetaInfo;
