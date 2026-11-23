import type { ChangeEvent } from 'react';

interface CampoFormularioProps {
  id: string;
  etiqueta: string;
  valor: string;
  onChange: (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  nombre?: string; // atributo name; si no viene, se usa el id
  tipo?: 'text' | 'email' | 'tel' | 'password' | 'textarea';
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}

// Label + input (o textarea) + mensaje de error de Bootstrap
function CampoFormulario({
  id, etiqueta, valor, onChange, nombre = id, tipo = 'text', placeholder, autoComplete, error,
}: CampoFormularioProps) {
  const clases = `form-control ${error ? 'is-invalid' : ''}`;

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{etiqueta}</label>
      {tipo === 'textarea' ? (
        <textarea id={id} name={nombre} rows={4} className={clases} value={valor} onChange={onChange} placeholder={placeholder} />
      ) : (
        <input id={id} name={nombre} type={tipo} className={clases} value={valor} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} />
      )}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export default CampoFormulario;
