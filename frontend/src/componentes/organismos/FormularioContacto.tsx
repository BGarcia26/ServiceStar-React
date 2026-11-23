import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { DatosContacto, ErroresContacto } from '../../interfaces';
import { validarContacto } from '../../utils/validaciones';
import { crearRequerimiento, erroresDeContacto } from '../../servicios/requerimientos';
import { ErrorApi } from '../../servicios/api';
import { useSesion } from '../../contexto/useSesion';
import CampoFormulario from '../moleculas/CampoFormulario';
import Boton from '../atomos/Boton';

type EstadoEnvio = 'inicial' | 'enviando' | 'enviado' | 'error';

function FormularioContacto() {
  const { usuario } = useSesion();

  // Si hay sesión iniciada, el nombre y el correo se completan con los del usuario.
  // Así el requerimiento aparece después en "Mis requerimientos".
  const valoresIniciales: DatosContacto = {
    nombre: usuario?.nombre ?? '', correo: usuario?.correo ?? '', telefono: '', mensaje: '',
  };

  // Estado con los valores escritos, los errores de validación y el estado del envío
  const [datos, setDatos] = useState<DatosContacto>(valoresIniciales);
  const [errores, setErrores] = useState<ErroresContacto>({});
  const [estado, setEstado] = useState<EstadoEnvio>('inicial');
  const [mensajeError, setMensajeError] = useState('');
  const [idCreado, setIdCreado] = useState<number | null>(null);

  const manejarCambio = (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  };

  const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const nuevosErrores = validarContacto(datos);
    setErrores(nuevosErrores);
    // Si hay errores no se envía nada
    if (Object.keys(nuevosErrores).length > 0) return;

    setEstado('enviando');
    try {
      // POST /api/contactos: Spring Boot valida y guarda el requerimiento en MySQL.
      const creado = await crearRequerimiento(datos);
      setIdCreado(creado.id);
      setEstado('enviado');
      setDatos(valoresIniciales);
    } catch (error) {
      // 400: el backend encontró datos inválidos y devuelve un mensaje por campo.
      if (error instanceof ErrorApi && error.status === 400) {
        setErrores(erroresDeContacto(error));
        setEstado('inicial');
        return;
      }
      setMensajeError(error instanceof Error ? error.message : 'No se pudo enviar el mensaje.');
      setEstado('error');
    }
  };

  return (
    <form noValidate onSubmit={manejarEnvio}>
      {estado === 'enviado' && (
        <div className="alert alert-success" role="alert">
          ¡Gracias! Registramos tu requerimiento N° {idCreado} y te contactaremos pronto.
          {usuario?.rol === 'CLIENTE' && (
            <> Puedes ver su estado en <Link to="/mis-requerimientos" className="alert-link">Mis requerimientos</Link>.</>
          )}
        </div>
      )}
      {estado === 'error' && (
        <div className="alert alert-danger" role="alert">{mensajeError}</div>
      )}

      <CampoFormulario id="nombre" etiqueta="Nombre o Empresa:" valor={datos.nombre} onChange={manejarCambio}
        placeholder="Ej: Juan Pérez - Empresa S.A." autoComplete="name" error={errores.nombre} />
      <CampoFormulario id="correo" etiqueta="Correo Corporativo:" tipo="email" valor={datos.correo} onChange={manejarCambio}
        placeholder="contacto@tuempresa.cl" autoComplete="email" error={errores.correo} />
      <CampoFormulario id="telefono" etiqueta="Teléfono:" tipo="tel" valor={datos.telefono} onChange={manejarCambio}
        placeholder="+56 9 1234 5678" autoComplete="tel" error={errores.telefono} />
      <CampoFormulario id="mensaje" etiqueta="Requerimiento:" tipo="textarea" valor={datos.mensaje} onChange={manejarCambio}
        placeholder="Detalla aquí tu necesidad..." error={errores.mensaje} />

      <Boton texto={estado === 'enviando' ? 'Enviando...' : 'Enviar Mensaje'} type="submit" bloque deshabilitado={estado === 'enviando'} />
    </form>
  );
}

export default FormularioContacto;
