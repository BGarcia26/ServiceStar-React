import { useContext } from 'react';
import { SesionContexto } from './SesionContexto';

// Hook para leer la sesión desde cualquier componente: const { usuario } = useSesion();
export function useSesion() {
  const valor = useContext(SesionContexto);
  if (!valor) {
    throw new Error('useSesion debe usarse dentro de <ProveedorSesion>.');
  }
  return valor;
}
