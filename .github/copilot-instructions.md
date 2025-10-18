## Resumen rápido

Esta guía ayuda a agentes de codificación a entender y contribuir rápidamente al frontend "MiGasto-Frontend" (Angular 20, standalone components).

## Arquitectura y flujo de datos

- Aplicación Angular moderna basada en standalone components y `bootstrapApplication` (`src/main.ts` y `src/app/app.ts`).
- Enrutamiento central en `src/app/app.routes.ts`. Rutas clave: `/login`, `/register`, `/home`, `/gastos`, `/ingresos`, `/dashboard`.
- Proveedores y configuración global en `src/app/app.config.ts`:
  - Se usa `provideHttpClient(withInterceptors([AuthInterceptor]))` para registrar el interceptor JWT.
  - Se usan `provideRouter(routes)` y detección por zonas con `provideZoneChangeDetection`.
- Autenticación:
  - `src/app/services/auth.service.ts` gestiona login/register, token guardado en `localStorage` (clave `token`) y comprobación `isAuthenticated()`.
  - `src/app/interceptor/auth.interceptor.ts` (tipo `HttpInterceptorFn`) inyecta el header Authorization: `Bearer <token>` excepto en llamadas a `/auth/login` y `/auth/register`.
  - Guard de rutas en `src/app/interceptor/guards/auth.guard.ts` que redirige a `/login` si no hay token.

## Convenciones de código y patrones observables

- Estilo standalone: los componentes declaran `imports` en el decorador (ej. `App` en `src/app/app.ts`). Mantén este patrón para nuevos componentes.
- Preferir API funcional/DI moderna: `inject()` para dependencias, `HttpInterceptorFn` para interceptores, `signal()` cuando ya está en uso.
- Evitar modificar el `bootstrapApplication` salvo que sea estrictamente necesario; agregar providers en `app.config.ts`.
- Tokens y persistencia: el token JWT se guarda en `localStorage`. Cualquier cambio debe respetar esa clave y compatibilidad con el interceptor.

## Flujo de trabajo para desarrolladores (comandos)

- Desarrollo local (Windows, en la raíz del repo):

  npm start

  (ejecuta `ng serve` según `package.json`)

- Build producción:

  npm run build

- Tests unitarios (Karma):

  npm test

- Notas: el `angular.json` define `public/` como assets; los archivos estáticos se colocan ahí.

## Dependencias e integraciones externas

- Backend esperado de autenticación: `http://localhost:8080/api/auth` (ver `auth.service.ts`). Ajustar variables si el backend cambia.
- Librerías notables: `@angular/material`, `ng2-charts` + `chart.js`, `tailwindcss` (presente en package.json). No instales duplicados.

## Cómo y dónde cambiar cosas (ejemplos concretos)

- Añadir un nuevo interceptor: editar `src/app/app.config.ts` y añadirlo a `withInterceptors([ ... ])`.
- Registrar una nueva ruta: agregar entrada en `src/app/app.routes.ts`. Sigue la convención de componentes standalone.
- Cambiar la lógica de auth: editar `src/app/services/auth.service.ts` (métodos `login`, `logout`, `getToken`, `isAuthenticated`). Mantén compatibilidad con `localStorage`.

## Restricciones y riesgos detectables

- No asumas módulo Angular tradicional (NgModule): el proyecto usa el enfoque standalone. Evita agregar NgModules sin razón.
- El interceptor excluye explícitamente `/auth/login` y `/auth/register` — mantener esa excepción evita problemas de autenticación.

## Petición de ayuda y próximos pasos

Si algo no está claro, dime qué sección quieres ampliar (ej.: añadir ejemplos de tests para un componente, o cómo mockear `AuthService` en pruebas). Puedo iterar rápido.
