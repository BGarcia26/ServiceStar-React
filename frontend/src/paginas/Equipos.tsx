import Hero from '../componentes/organismos/Hero';
import SeccionTarjetas from '../componentes/organismos/SeccionTarjetas';
import { equiposLicencias } from '../data/servicios';

function Equipos() {
  return (
    <>
      <Hero
        compacto
        titulo="Hardware y Licenciamiento"
        texto="Infraestructura física y lógica respaldada por las mejores marcas a nivel mundial."
        imagen="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1920"
      />
      <main className="container py-5">
        <SeccionTarjetas items={equiposLicencias} />
      </main>
    </>
  );
}

export default Equipos;
