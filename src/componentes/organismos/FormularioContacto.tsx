import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { DatosContacto, ErroresContacto } from '../../interfaces';
import { validarContacto } from '../../utils/validaciones';
import CampoFormulario from '../moleculas/CampoFormulario';
import Boton from '../atomos/Boton';

const valoresIniciales: DatosContacto = { nombre: '', correo: '', telefono: '', mensaje: '' };

// Servicio externo que reenvía el formulario por correo (no requiere backend propio)
const URL_FORMSUBMIT = 'https://formsubmit.co/ajax/contacto@servicestar.cl';

type EstadoEnvio = 'inicial' | 'enviando' | 'enviado' | 'error';

function FormularioContacto() {
  // Estado con los valores escritos, los errores de validación y el estado del envío
  const [datos, setDatos] = useState<DatosContacto>(valoresIniciales);
  const [errores, setErrores] = useState<ErroresContacto>({});
  const [estado, setEstado] = useState<EstadoEnvio>('inicial');

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
      const respuesta = await fetch(URL_FORMSUBMIT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...datos, _subject: 'Nuevo requerimiento web Service Star', _captcha: 'false' }),
      });
      if (!respuesta.ok) throw new Error('Error al enviar');
      setEstado('enviado');
      setDatos(valoresIniciales);
    } catch {
      setEstado('error');
    }
  };

  return (
    <form noValidate onSubmit={manejarEnvio}>
      {estado === 'enviado' && (
        <div className="alert alert-success" role="alert">
          ¡Gracias! Recibimos tu requerimiento y te contactaremos pronto.
        </div>
      )}
      {estado === 'error' && (
        <div className="alert alert-danger" role="alert">
          No se pudo enviar el mensaje. Inténtalo nuevamente más tarde.
        </div>
      )}

      <CampoFormulario id="nombre" etiqueta="Nombre o Empresa:" valor={datos.nombre} onChange={manejarCambio}
        placeholder="Ej: Juan Pérez - Empresa S.A." autoComplete="name" error={errores.nombre} />
      <CampoFormulario id="correo" etiqueta="Correo Corporativo:" tipo="email" valor={datos.correo} onChange={manejarCambio}
        placeholder="contacto@tuempresa.cl" autoComplete="email" error={errores.correo} />
      <CampoFormulario id="telefono" etiqueta="Teléfono:" tipo="tel" valor={datos.telefono} onChange={manejarCambio}
        placeholder="+56 9 1234 5678" autoComplete="tel" error={errores.telefono} />
      <CampoFormulario id="mensaje" etiqueta="Requerimiento:" tipo="textarea" valor={datos.mensaje} onChange={manejarCambio}
        placeholder="Detalla aquí tu necesidad..." error={errores.mensaje} />

      <Boton texto={estado === 'enviando' ? 'Enviando...' : 'Enviar Mensaje'} type="submit" bloque />
    </form>
  );
}

export default FormularioContacto;
