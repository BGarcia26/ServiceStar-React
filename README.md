# Service Star – React + Vite + TypeScript

Migración del sitio Service Star (HTML/CSS/JS) a React, usando Bootstrap, React Router y Atomic Design.

## Ejecutar

```bash
npm install
npm run dev
```

## Estructura (Atomic Design)

```
src/
├── componentes/
│   ├── atomos/       Boton, NavItem, Etiqueta
│   ├── moleculas/    TarjetaProducto, TarjetaInfo, CampoFormulario
│   └── organismos/   BarraNavegacion, Hero, GrillaProductos, SeccionTarjetas, FormularioContacto, PiePagina
├── paginas/          Inicio, Servicios, Equipos, Tienda, DetalleProducto
├── interfaces/       Interfaces TypeScript (Producto, Servicio, DatosContacto)
├── data/             Datos de productos y servicios
├── utils/            Validaciones del formulario
├── App.tsx           Definición de rutas
└── main.tsx          BrowserRouter + Bootstrap
```

## Rutas

| Ruta          | Página                                   |
|---------------|------------------------------------------|
| `/`           | Inicio (misión, visión y formulario)     |
| `/servicios`  | Servicios TIC                            |
| `/equipos`    | Equipos y Licencias                      |
| `/tienda`     | Catálogo de productos                    |
| `/tienda/:id` | Detalle del producto (ruta dinámica con `useParams`) |

Recorrido: Inicio → Tienda → Ver detalle → Volver a la tienda.
