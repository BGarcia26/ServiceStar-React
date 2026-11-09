import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { DatosContacto, ErroresContacto } from '../../interfaces';
import { validarContacto } from '../../utils/validaciones';
import CampoFormulario from '../moleculas/CampoFormulario';
import Boton from '../atomos/Boton';

const valoresIniciales: DatosContacto = { nombre: '', correo: '', telefono: '', mensaje: '' };

function FormularioContacto() {
  // Estado con los valores escritos y los errores de validación
  const [datos, setDatos] = useState<DatosContacto>(valoresIniciales);
  const [errores, setErrores] = useState<ErroresContacto>({});
  const [enviado, setEnviado] = useState(false);

  const manejarCambio = (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
    setEnviado(false);
  };

  const manejarEnvio = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const nuevosErrores = validarContacto(datos);
    setErrores(nuevosErrores);
    // Solo si no hay errores se confirma el envío y se limpia el formulario
    if (Object.keys(nuevosErrores).length === 0) {
      setEnviado(true);
      setDatos(valoresIniciales);
    }
  };

  return (
    <form noValidate onSubmit={manejarEnvio}>
      {enviado && (
        <div className="alert alert-success" role="alert">
          ¡Gracias! Recibimos tu requerimiento y te contactaremos pronto.
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

      <Boton texto="Enviar Mensaje" type="submit" bloque />
    </form>
  );
}

export default FormularioContacto;
