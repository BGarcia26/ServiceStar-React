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

  const manejarCambio = (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  };

  const manejarEnvio = (evento: FormEvent<HTMLFormElement>) => {
    const nuevosErrores = validarContacto(datos);
    setErrores(nuevosErrores);
    // Si hay errores se bloquea el envío a FormSubmit
    if (Object.keys(nuevosErrores).length > 0) {
      evento.preventDefault();
    }
  };

  return (
    <form action="https://formsubmit.co/mgarcia@itdata.cl" method="POST" noValidate onSubmit={manejarEnvio}>
      <input type="hidden" name="_subject" value="Nuevo requerimiento web ITDATA" />
      <input type="hidden" name="_captcha" value="false" />

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
