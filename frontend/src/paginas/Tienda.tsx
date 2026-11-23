import Hero from '../componentes/organismos/Hero';
import GrillaProductos from '../componentes/organismos/GrillaProductos';
import SeccionTarjetas from '../componentes/organismos/SeccionTarjetas';
import { productos } from '../data/productos';
import { categoriasHardware } from '../data/servicios';

function Tienda() {
  return (
    <>
      <Hero
        compacto
        titulo="Catálogo de Equipos e Insumos"
        texto="Infraestructura de primer nivel con el respaldo de los principales mayoristas del país."
        imagen="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1920"
      />
      <main className="container py-5">
        <section className="mb-5">
          <h2 className="text-center text-white mb-4">🔥 Promos de la Semana</h2>
          <GrillaProductos productos={productos} />
        </section>

        <SeccionTarjetas
          titulo="Categorías de Hardware"
          items={categoriasHardware}
          textoBoton="Cotizar"
          rutaBoton="/#contacto"
        />
      </main>
    </>
  );
}

export default Tienda;
