// Estructura de un producto del catálogo de la tienda
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  marca: string;
  etiqueta: string;
  imagen: string;
}

// Estructura de las tarjetas informativas (servicios, pilares, categorías)
export interface Servicio {
  titulo: string;
  descripcion: string;
}

// Valores del formulario de contacto
export interface DatosContacto {
  nombre: string;
  correo: string;
  telefono: string;
  mensaje: string;
}

// Mensajes de error por cada campo del formulario
export type ErroresContacto = Partial<Record<keyof DatosContacto, string>>;
