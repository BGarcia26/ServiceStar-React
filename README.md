# Service Star – React + Spring Boot

Sitio de Service Star con frontend en **React + Vite + TypeScript** y backend en **Spring Boot** con **MySQL**.
El formulario de contacto guarda los requerimientos en la base de datos mediante una **API REST**, y la gestión
de esos requerimientos está protegida con **JWT y roles**.

```
ServiceStar-React/
├── frontend/   React 19 + Vite + TypeScript + Bootstrap + React Router (Atomic Design)
└── backend/    Spring Boot 4 + Java 21 + Spring Data JPA + MySQL + Flyway + Spring Security (JWT) + Swagger
```

## Requisitos

- Node.js 20 o superior
- JDK 21
- MySQL 8 (por ejemplo, el de **Laragon**)

## 1. Levantar el backend (puerto 8082)

La base de datos `servicestar` se crea sola y **Flyway** crea las tablas al iniciar.
El usuario y la contraseña de MySQL se pasan como variables de entorno (no se guardan en el repositorio):

```powershell
cd backend
$env:DB_USERNAME="root"
$env:DB_PASSWORD="tu_contraseña"   # si root no tiene contraseña, omite esta línea
.\mvnw.cmd spring-boot:run
```

| Variable | Valor por defecto | Para qué sirve |
|---|---|---|
| `DB_HOST` / `DB_PORT` | `localhost` / `3306` | Servidor MySQL |
| `DB_USERNAME` / `DB_PASSWORD` | `root` / (vacía) | Credenciales de MySQL |
| `JWT_SECRET` | clave de desarrollo | Clave para firmar los tokens (mínimo 32 caracteres) |
| `ADMIN_PASSWORD` | `Admin123*` | Contraseña del administrador inicial |

- **Swagger:** http://localhost:8082/swagger-ui.html
- **Pruebas de integración:** `.\mvnw.cmd test` (usan H2 en memoria, no necesitan MySQL)

## 2. Levantar el frontend (puerto 5173)

```powershell
cd frontend
npm install
npm run dev
```

Abrir http://localhost:5173. La URL de la API se puede cambiar con `VITE_API_URL` (ver `frontend/.env.example`).

## Usuarios

| Rol | Cómo se obtiene | Qué puede hacer |
|---|---|---|
| Visitante | — | Navegar el sitio y enviar el formulario de contacto |
| `CLIENTE` | Se registra en `/registro` | Ver el estado de sus requerimientos en **Mis requerimientos** |
| `ADMIN` | Se crea al iniciar la API: `admin@servicestar.cl` / `Admin123*` (solo desarrollo) | Panel con todos los requerimientos: marcar atendido, editar y eliminar |

## API REST

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/registro` | Público | Crea una cuenta CLIENTE y devuelve un JWT |
| POST | `/api/auth/login` | Público | Valida credenciales y devuelve un JWT |
| GET | `/api/auth/perfil` | Con token | Datos del usuario del token |
| POST | `/api/contactos` | Público | Crea un requerimiento (formulario de contacto) |
| GET | `/api/contactos` | ADMIN | Lista todos los requerimientos |
| GET | `/api/contactos/mios` | CLIENTE, ADMIN | Requerimientos del usuario del token |
| GET | `/api/contactos/{id}` | ADMIN | Obtiene un requerimiento |
| PUT | `/api/contactos/{id}` | ADMIN | Actualiza un requerimiento |
| PUT | `/api/contactos/{id}/estado` | ADMIN | Cambia el estado (`PENDIENTE` / `ATENDIDO`) |
| DELETE | `/api/contactos/{id}` | ADMIN | Elimina un requerimiento |

Las rutas protegidas reciben el header `Authorization: Bearer <token>`.
Errores: `400` datos inválidos (con el mensaje de cada campo), `401` sin token o token inválido,
`403` rol sin permiso, `404` no existe, `409` correo ya registrado.

## Estructura

### Backend (`backend/src/main/java/cl/servicestar/api`)

```
controller/   ContactoController, AuthController            → endpoints REST
service/      ContactoService, AuthService, TokenService     → lógica de negocio y generación de JWT
repository/   ContactoRepository, UsuarioRepository         → acceso a datos (Spring Data JPA)
model/        Contacto, Usuario                             → entidades (tablas contacto y usuario)
dto/          *Request / *Response                          → datos que entran y salen, con validaciones
config/       SecurityConfig, OpenApiConfig, DatosIniciales → roles y JWT, Swagger y admin inicial
exception/    ManejadorErrores + excepciones                → errores en formato JSON
resources/db/migracion/   V1 a V4                           → migraciones Flyway
```

### Frontend (`frontend/src`)

```
componentes/atomos/      Boton, NavItem, Etiqueta
componentes/moleculas/   TarjetaProducto, TarjetaInfo, CampoFormulario, TarjetaRequerimiento, ModalConfirmacion
componentes/organismos/  BarraNavegacion, Hero, GrillaProductos, SeccionTarjetas, FormularioContacto,
                         ListaRequerimientos, ModalEditarRequerimiento, PiePagina
paginas/                 Inicio, Servicios, Equipos, Tienda, DetalleProducto, Login, Registro,
                         MisRequerimientos, PanelAdmin
servicios/               api.ts (fetch + token + errores), requerimientos.ts, autenticacion.ts
contexto/                ProveedorSesion, SesionContexto, useSesion → estado global de la sesión
rutas/                   RutaProtegida → exige sesión y rol
interfaces/ data/ utils/ tipos, datos del catálogo y validaciones
```

## Sesión en el frontend

- Al iniciar sesión, el token JWT y los datos del usuario se guardan en `localStorage`, por lo que la sesión
  **se mantiene al recargar la página**.
- Al recargar, la sesión guardada se descarta si ya expiró y, si sigue vigente, se confirma con `GET /api/auth/perfil`.
- La sesión se cierra sola cuando el token expira (120 minutos) o si la API responde `401`.
- `RutaProtegida` impide abrir páginas sin sesión o sin el rol necesario. La protección real está en el backend.
