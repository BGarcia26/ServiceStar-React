import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { DatosLogin, ErroresLogin, Usuario } from '../interfaces';
import { validarLogin } from '../utils/validaciones';
import { useSesion } from '../contexto/useSesion';
import CampoFormulario from '../componentes/moleculas/CampoFormulario';
import Boton from '../componentes/atomos/Boton';

// Página de destino según el rol del usuario
const inicioSegunRol = (usuario: Usuario) => (usuario.rol === 'ADMIN' ? '/admin' : '/mis-requerimientos');

function Login() {
  const { usuario, iniciarSesion, sesionExpirada } = useSesion();
  const navigate = useNavigate();
  const location = useLocation();
  // Página que el usuario intentaba abrir antes de que se le pidiera iniciar sesión
  const desde = (location.state as { desde?: string } | null)?.desde;

  const [datos, setDatos] = useState<DatosLogin>({ correo: '', password: '' });
  const [errores, setErrores] = useState<ErroresLogin>({});
  const [mensajeError, setMensajeError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Si ya hay sesión, no tiene sentido mostrar el login
  if (usuario && !enviando) {
    return <Navigate to={inicioSegunRol(usuario)} replace />;
  }

  const manejarCambio = (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  };

  const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const nuevosErrores = validarLogin(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    setMensajeError('');
    try {
      const usuarioIngresado = await iniciarSesion(datos);
      navigate(desde ?? inicioSegunRol(usuarioIngresado), { replace: true });
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
      setEnviando(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <section className="seccion-contacto p-4 p-md-5">
            <h1 className="h3 text-white text-center mb-2">Iniciar sesión</h1>
            <p className="text-secondary text-center mb-4">Ingresa para revisar tus requerimientos.</p>

            {sesionExpirada && !mensajeError && (
              <div className="alert alert-warning" role="alert">Tu sesión expiró. Vuelve a iniciar sesión.</div>
            )}
            {mensajeError && <div className="alert alert-danger" role="alert">{mensajeError}</div>}

            <form noValidate onSubmit={manejarEnvio}>
              <CampoFormulario id="correo" etiqueta="Correo:" tipo="email" valor={datos.correo} onChange={manejarCambio}
                autoComplete="email" error={errores.correo} />
              <CampoFormulario id="password" etiqueta="Contraseña:" tipo="password" valor={datos.password} onChange={manejarCambio}
                autoComplete="current-password" error={errores.password} />
              <Boton texto={enviando ? 'Ingresando...' : 'Ingresar'} type="submit" bloque deshabilitado={enviando} />
            </form>

            <p className="text-center text-secondary small mt-4 mb-0">
              ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Login;
