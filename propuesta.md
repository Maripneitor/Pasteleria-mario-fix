Arquitectura de Desacoplamiento: Frontend & Backend
Este documento detalla la estrategia técnica para separar la actual aplicación monolítica en Node.js en una arquitectura de servicios desacoplados, separando la capa de presentación (Frontend) de la lógica de negocio y datos (Backend).

1. Estructura de Repositorios
Se recomienda una estrategia de Monorepositorio (Monorepo) utilizando herramientas como TurboRepo o Nx. Esto facilita la gestión de dependencias compartidas, estándares de código unificados y simplifica el pipeline de CI/CD mientras se mantiene una separación lógica clara.

Estructura Propuesta
/root
  /apps
    /backend      (API RESTful en Node.js/Express/NestJS)
    /frontend     (React/Next.js/Vue)
  /packages
    /shared-types (Interfaces TypeScript compartidas, DTOs)
    /eslint-config
    /ui-kit       (Componentes de UI si es necesario a futuro)
  /docs           (Documentación de API y Arquitectura)
  package.json
  turbo.json
Beneficios:

Shared Types: El frontend y backend pueden compartir interfaces de TypeScript, asegurando que si el backend cambia un contrato, el frontend detecta el error en tiempo de compilación.
Despliegue Independiente: Aunque vivan juntos, se configuran pipelines para desplegar /apps/backend y /apps/frontend de forma independiente.
2. Contratos de API (Modernización a RESTful)
El backend dejará de servir HTML (SSR con plantillas tipo Pug/EJS) y pasará a servir exclusivamente JSON.

Transformación de Rutas
Ruta Actual (Monolito)	Nueva Ruta (API)	Método	Respuesta
GET /dashboard (Render HTML)	GET /api/v1/dashboard/stats	GET	JSON { "stats": {...} }
POST /login (Redirect)	POST /api/v1/auth/login	POST	JSON { "token": "..." }
GET /users/:id (Render Profile)	GET /api/v1/users/:id	GET	JSON { "user": {...} }
Estándar de Respuesta JSON
Todas las respuestas deberán seguir una estructura predecible (Envelope Pattern):

// Éxito
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 100 } // Opcional para paginación
}
// Error
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User not found",
    "details": [] 
  }
}
3. Estrategia de CORS (Cross-Origin Resource Sharing)
Dado que el Frontend y Backend probablemente vivirán en dominios o subdominios diferentes (ej. app.midominio.com y api.midominio.com), se debe configurar CORS estrictamente en el Backend.

Configuración en Node.js (ej. cors middleware):

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','), // ej: ['https://app.midominio.com']
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Permitir cookies si se usaran (aunque pasaremos a JWT en headers)
  maxAge: 86400 // Cache de preflight request por 24h
};
app.use(cors(corsOptions));
4. Autenticación: Migración a Stateless JWT
Estado Actual: Sesiones (Stateful)
Actualmente, el servidor mantiene una sesión en memoria o Redis y envía una cookie connect.sid. El servidor "recuerda" al usuario.

Nuevo Estado: JWT (Stateless)
El servidor no guardará estado de sesión. Cada petición debe ser autenticada por sí misma.

Flujo de Migración
Login:

El usuario envía credenciales (email, password) a POST /api/v1/auth/login.
El Backend valida y genera dos tokens:
Access Token (JWT): Corta duración (ej. 15 min). Contiene claims mínimos (uid, role). Firmado con clave privada.
Refresh Token: Larga duración (ej. 7 días). Guardado en DB asociado al usuario para poder revocarlo.
Transporte:

Se recomienda enviar el Access Token en el cuerpo de la respuesta y que el cliente lo almacene en memoria (no localStorage por seguridad XSS) o enviarlo en una Cookie HttpOnly, Secure, SameSite=Strict si se quiere máxima seguridad.
Para este diseño SPA agnóstico, usaremos el header estándar: Authorization: Bearer <token>
Middleware de Autenticación (Backend):

Intercepta requests protegidos.
Verifica firma del JWT.
Si expira, responde 401 Unauthorized.
Renovación (Refresh Token Flow):

El Frontend intercepta el 401.
Llama a POST /api/v1/auth/refresh enviando el Refresh Token (idealmente en cookie HttpOnly).
Backend valida Refresh Token en DB, genera nuevo Access Token y lo devuelve.
5. Restricción: Backend Agnóstico al Cliente
Para cumplir con la restricción de que el backend sirva tanto a Web como a Mobile:

Cero Redirecciones HTTP (301/302): El backend nunca debe redirigir al navegador a una página de login. Siempre debe devolver códigos de error (401, 403) y dejar que el cliente decida cómo manejar la navegación.
Formato de Errores Unificados: No devolver HTML en errores 500. Siempre JSON.
Autenticación Flexible: Soportar autenticación vía Headers (Authorization: Bearer) es estándar para móviles y web SPAs.