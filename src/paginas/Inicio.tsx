import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../componentes/organismos/Hero';
import SeccionTarjetas from '../componentes/organismos/SeccionTarjetas';
import FormularioContacto from '../componentes/organismos/FormularioContacto';
import Boton from '../componentes/atomos/Boton';
import { pilares } from '../data/servicios';

function Inicio() {
  const { hash } = useLocation();

  // Permite llegar directo al formulario desde otras páginas (/#contacto)
  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <>
      <Hero
        titulo="Expertos en Proyectos de Tecnologías de la Información"
        texto="Nuestra empresa nace el año 2016, formada por profesionales TI con 18 años de experiencia en el rubro."
        imagen="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920"
      >
        <Boton texto="Conoce Nuestros Pilares" href="#pilares" />
      </Hero>

      <main className="container py-5">
        <SeccionTarjetas id="pilares" titulo="Nuestra Filosofía Corporativa" items={pilares} />

        <section id="contacto" className="seccion-contacto p-4 p-md-5 mt-5">
          <h2 className="text-center text-white mb-2">Trabajemos Juntos</h2>
          <p className="text-center text-secondary mb-5">
            Contáctanos para optimizar tus procesos y mejorar la competitividad de tu empresa.
          </p>
          <div className="row g-5">
            <div className="col-12 col-lg-6">
              <FormularioContacto />
            </div>
            <div className="col-12 col-lg-6">
              <iframe
                className="mapa"
                title="Ubicación Service Star"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.3596332358366!2d-70.65569962273985!3d-33.43993577339376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a43c311187%3A0xb4d8ce96714b4844!2sHu%C3%A9rfanos%201160%2C%20Ofi%201102%2C%208340420%20Santiago%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1788799006996!5m2!1ses-419!2scl"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Inicio;
