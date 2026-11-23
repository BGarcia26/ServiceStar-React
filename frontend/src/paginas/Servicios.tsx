import Hero from '../componentes/organismos/Hero';
import SeccionTarjetas from '../componentes/organismos/SeccionTarjetas';
import { serviciosTic } from '../data/servicios';

function Servicios() {
  return (
    <>
      <Hero
        compacto
        titulo="Soluciones TIC Empresariales"
        texto="Nos encargaremos de todo, para que tú puedas cumplir los principales objetivos del área."
        imagen="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920"
      />
      <main className="container py-5">
        <SeccionTarjetas items={serviciosTic} />
      </main>
    </>
  );
}

export default Servicios;
