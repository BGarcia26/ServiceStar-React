import type { Servicio } from '../../interfaces';
import TarjetaInfo from '../moleculas/TarjetaInfo';

interface SeccionTarjetasProps {
  items: Servicio[];
  titulo?: string;
  id?: string;
  textoBoton?: string;
  rutaBoton?: string;
}

function SeccionTarjetas({ items, titulo, id, textoBoton, rutaBoton }: SeccionTarjetasProps) {
  return (
    <section id={id} className="mb-5">
      {titulo && <h2 className="text-center text-white mb-4">{titulo}</h2>}
      <div className="row g-4">
        {items.map((item) => (
          <div key={item.titulo} className="col-12 col-md-6 col-lg">
            <TarjetaInfo titulo={item.titulo} descripcion={item.descripcion} textoBoton={textoBoton} rutaBoton={rutaBoton} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default SeccionTarjetas;
