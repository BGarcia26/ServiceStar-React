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

// ---------- Datos que vienen de la API (Spring Boot) ----------

export type EstadoRequerimiento = 'PENDIENTE' | 'ATENDIDO';

// Un requerimiento guardado en MySQL (tabla contacto)
export interface Requerimiento {
  id: number;
  nombreCompleto: string;
  correo: string;
  telefono: string | null;
  mensaje: string;
  estado: EstadoRequerimiento;
  fechaCreacion: string; // fecha en formato ISO, ej: 2026-11-23T10:15:00
}

// ---------- Autenticación ----------

export type Rol = 'ADMIN' | 'CLIENTE';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
}

// Lo que se guarda en el navegador después de iniciar sesión
export interface Sesion {
  token: string;     // JWT que se envía en el header Authorization
  expiraEn: string;  // fecha ISO en que el token deja de ser válido
  usuario: Usuario;
}

export interface DatosLogin {
  correo: string;
  password: string;
}

export interface DatosRegistro {
  nombre: string;
  correo: string;
  password: string;
  confirmacion: string;
}

export type ErroresLogin = Partial<Record<keyof DatosLogin, string>>;
export type ErroresRegistro = Partial<Record<keyof DatosRegistro, string>>;
