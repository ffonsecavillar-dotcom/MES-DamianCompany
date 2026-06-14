# MES ERP MVP

Aplicacion web MVP para una empresa pequena de creacion digital, impresion 3D y proyectos mecatronicos.

## Stack

- React + Vite.
- Node.js + Express.
- PostgreSQL opcional mediante `DATABASE_URL`.
- Persistencia demo local en `data/mes-demo.json` cuando no existe `DATABASE_URL`.
- Almacenamiento local de archivos en `uploads/`.

## Inicio Rapido

```bash
npm install
npm run build
npm start
```

Abrir:

```text
http://localhost:4000
```

Las credenciales de administrador se configuran con variables de entorno:

```text
ADMIN_EMAIL
ADMIN_PASSWORD
```

## Desarrollo

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:4000
```

## Variables de Entorno

Copiar `.env.example` a `.env` si se desea configurar el entorno.

```text
PORT=4000
JWT_SECRET=change-this-local-secret
DATABASE_URL=postgres://postgres:postgres@localhost:5432/mes_erp
UPLOAD_DIR=uploads
```

Si `DATABASE_URL` no esta configurado, la app usa persistencia local demo en `data/mes-demo.json`.

## Base de Datos PostgreSQL

El esquema base esta en:

```text
database/schema.sql
```

El MVP usa una tabla `app_records` con `jsonb` por modulo para acelerar iteracion inicial, mantener persistencia PostgreSQL y permitir indices por estado, proyecto y cliente.

## Modulos Implementados

- Dashboard.
- Login y roles basicos.
- Clientes.
- Solicitudes.
- Cotizaciones.
- Proyectos.
- Tareas.
- Archivos tecnicos versionados.
- Ordenes de trabajo.
- Produccion Kanban.
- Maquinas.
- Inventario.
- Compras.
- Calidad.
- Entregas.
- Pagos.
- Costos.
- Usuarios.

## Flujos MVP

- Login con usuario demo.
- Crear, editar y eliminar registros por modulo.
- Convertir solicitud a cotizacion seleccionando una fila de Solicitudes.
- Convertir cotizacion a proyecto seleccionando una fila de Cotizaciones.
- Ver proyecto con panel lateral de tareas, ordenes, archivos y costos.
- Subir archivo tecnico desde el panel de proyecto.
- Aprobar archivo para fabricacion.
- Mover ordenes de trabajo desde el Kanban de Produccion.
- Consultar dashboard operativo y financiero.
- Generar PDF simple de cotizacion en `/api/quotes/:id/pdf`.

## Verificacion

```bash
npm run typecheck
npm run build
node scripts/verify-api.mjs
node scripts/verify-ui.mjs
```

Las capturas de QA visual se guardan en:

```text
qa/
```

## Notas

- La facturacion del MVP es registro interno simple de pagos, anticipos y saldos.
- No incluye portal de cliente externo.
- No incluye facturacion electronica formal.
- No incluye integraciones directas con impresoras 3D.
