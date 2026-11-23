import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import type { DatosRegistro, ErroresRegistro } from '../interfaces';
import { validarRegistro } from '../utils/validaciones';
import { useSesion } from '../contexto/useSesion';
import { ErrorApi } from '../servicios/api';
import CampoFormulario from '../componentes/moleculas/CampoFormulario';
import Boton from '../componentes/atomos/Boton';

function Registro() {
  const { usuario, registrarse } = useSesion();
  const navigate = useNavigate();

  const [datos, setDatos] = useState<DatosRegistro>({ nombre: '', correo: '', password: '', confirmacion: '' });
  const [errores, setErrores] = useState<ErroresRegistro>({});
  const [mensajeError, setMensajeError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario && !enviando) {
    return <Navigate to="/" replace />;
  }

  const manejarCambio = (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  };

  const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const nuevosErrores = validarRegistro(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    setMensajeError('');
    try {
      await registrarse(datos);
      navigate('/mis-requerimientos', { replace: true });
    } catch (error) {
      // 400: errores por campo del backend. 409: el correo ya existe.
      if (error instanceof ErrorApi && error.status === 400) setErrores(error.errores);
      setMensajeError(error instanceof Error ? error.message : 'No se pudo crear la cuenta.');
      setEnviando(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <section className="seccion-contacto p-4 p-md-5">
            <h1 className="h3 text-white text-center mb-2">Crear cuenta</h1>
            <p className="text-secondary text-center mb-4">Con tu cuenta podrás seguir el estado de tus requerimientos.</p>

            {mensajeError && <div className="alert alert-danger" role="alert">{mensajeError}</div>}

            <form noValidate onSubmit={manejarEnvio}>
              <CampoFormulario id="nombre" etiqueta="Nombre o Empresa:" valor={datos.nombre} onChange={manejarCambio}
                autoComplete="name" error={errores.nombre} />
              <CampoFormulario id="correo" etiqueta="Correo:" tipo="email" valor={datos.correo} onChange={manejarCambio}
                autoComplete="email" error={errores.correo} />
              <CampoFormulario id="password" etiqueta="Contraseña (mínimo 8 caracteres):" tipo="password" valor={datos.password}
                onChange={manejarCambio} autoComplete="new-password" error={errores.password} />
              <CampoFormulario id="confirmacion" etiqueta="Repite la contraseña:" tipo="password" valor={datos.confirmacion}
                onChange={manejarCambio} autoComplete="new-password" error={errores.confirmacion} />
              <Boton texto={enviando ? 'Creando cuenta...' : 'Crear cuenta'} type="submit" bloque deshabilitado={enviando} />
            </form>

            <p className="text-center text-secondary small mt-4 mb-0">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Registro;
