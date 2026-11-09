import type { Producto } from '../interfaces';

export const productos: Producto[] = [
  {
    id: 1,
    nombre: 'Dell Monitor 27" FHD',
    descripcion:
      'Potencia tu productividad con un monitor IPS de 27 pulgadas, conexión USB-C con Power Delivery y tasa de refresco de 100Hz, ideal para puestos de trabajo corporativos.',
    categoria: 'Monitores',
    marca: 'Dell',
    etiqueta: 'Soporte ITDATA',
    imagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=500',
  },
  {
    id: 2,
    nombre: 'Dell Pro Intel® Core™ Ultra',
    descripcion:
      'Productividad del futuro: laptops y workstations Dell Pro con procesadores Intel® Core™ Ultra, pensadas para desarrolladores y ejecutivos.',
    categoria: 'Laptops',
    marca: 'Dell',
    etiqueta: 'Partner Autorizado',
    imagen: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=500',
  },
  {
    id: 3,
    nombre: 'ViewSonic IFP 65" 4K',
    descripcion:
      'Pantalla interactiva touchscreen 4K Ultra HD de 65 pulgadas para reuniones más eficaces y colaborativas.',
    categoria: 'Pantallas interactivas',
    marca: 'ViewSonic',
    etiqueta: 'Soporte Especializado',
    imagen: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=500',
  },
  {
    id: 4,
    nombre: 'Kingston SSD 480GB A400',
    descripcion:
      'Acelera tu sistema con una unidad de estado sólido de 480GB, ideal para PCs y laptops corporativos.',
    categoria: 'Almacenamiento',
    marca: 'Kingston',
    etiqueta: 'Marca de Calidad',
    imagen: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?q=80&w=500',
  },
];
