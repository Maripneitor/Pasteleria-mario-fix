# 🕵️‍♂️ Auditoría Frontend: Pastelería La Fiesta

**Fecha:** 26/01/2026
**Responsable:** Antigravity (IA Agent)
**Estado:** `PLANNING`

---

## 🗺️ 1. Mapa de Rutas y Navegación

El proyecto utiliza **React Router v7** con un sistema de rutas protegidas y *lazy loading*.

| Path | Componente (Vista) | Roles Permitidos | Notas |
| :--- | :--- | :--- | :--- |
| **Públicas** | | | |
| `/login` | `Login` | *Todos* | |
| `/register` | `Register` | *Todos* | |
| **Dashboard** | | | |
| `/dashboard` | `Dashboard` | `DEVELOPER`, `OWNER` | **Vista Principal**. Datos mockeados actualmente due to fallback. |
| `/dashboard/owner` | `OwnerDashboard` | `DEVELOPER`, `OWNER` | Posible duplicidad con `/dashboard`. |
| `/estadisticas` | `Statistics` | `DEVELOPER`, `OWNER` | |
| `/calendario` | `Calendar` | `DEVELOPER`, `OWNER` | |
| **Operaciones** | | | |
| `/folios` | `Folios` | `DEV`, `OWNER`, `EMPLOYEE` | **Core**. Gestión de pedidos. Search/Filter local. |
| `/folio/nuevo` | `NewFolio` | `DEV`, `OWNER`, `EMPLOYEE` | Formulario creación. |
| `/produccion` | `KanbanBoard` | `DEV`, `OWNER`, `EMPLOYEE` | Vista Kanban. |
| **Sistema/Dev** | | | |
| `/dev-dashboard` | `DevDashboard` | `DEVELOPER` | "Panic Button" & Logs. Estilo "Terminal". |
| `/dashboard/developer`| `DeveloperDashboard` | `DEVELOPER` | Gráficas "System Monitor". **DUPLICADO CONCEPTUAL**. |
| `/kitchen` | `KitchenDisplay` | `DEV`, `OWNER`, `PROD`, `EMP` | Pantalla Completa (KDS). |

---

## 🎯 2. Vistas Priorizadas (Top 8)

1.  **Folios (`/folios`)**: El corazón operativo. Complejidad alta (Búsqueda, Filtros, Modales).
2.  **Dashboard (`/dashboard`)**: Primera impresión del dueño. Actualmente usa mocks.
3.  **NewFolio (`/folio/nuevo`)**: Entrada de dinero. Crítico que funcione rápido.
4.  **KitchenDisplay (`/kitchen`)**: Operación en tiempo real.
5.  **Produccion (`/produccion`)**: Kanban para organización.
6.  **Login (`/login`)**: Puerta de entrada.
7.  **Clients (`/clientes`)**: Gestión de base de datos de clientes.
8.  **DeveloperDashboard / DevDashboard**: Herramientas de mantenimiento (necesitan unificación).

---

## ⚠️ 3. Hallazgos y Puntos de Dolor (Top 10)

### 🔴 Críticos (Prioridad Alta)
1.  **Datos Mockeados en Dashboard**: `Dashboard.jsx` (Líneas 43-49) simula la llamada a API (`/dashboard/daily-summary`) con `setTimeout` y datos estáticos `mockOrders`. Riesgo de discrepancia con datos reales.
2.  **Duplicidad de Dashboards de Desarrollador**: Existen `DevDashboard.jsx` (Estilo Hacker/Terminal) y `DeveloperDashboard.jsx` (Gráficas Monitor). Confuso cuál es la fuente de verdad para debug.
3.  **Componentes "EmptyState" Ignorados**: `Folios.jsx` importa `EmptyState` pero implementa su propia UI de "No resultados" inline (Líneas 274-288). Inconsistencia visual.
4.  **Inconsistencia en Loaders**:
    -   `App.jsx`: Usa `CakeLoader` (muy visual).
    -   `Folios.jsx`: Usa `FolioCardSkeleton`.
    -   `Dashboard.jsx`: Usa un `Skeleton` genérico de `components/ui`.
    -   *Acción*: Estandarizar estrategia de carga (Skeleton para contenido, CakeLoader para pantallas completas).

### 🟡 Medios (Mejora DX/UX)
5.  **Hardcoded Role Checks**: En `Dashboard.jsx`, se verifican permisos con strings hardcodeados (`user?.role === 'Dueño'`). Debería usar constantes `ROLES` de `config/permissions.js` unificadas con `useAuth`.
6.  **Manejo de Errores Inline**: `Folios.jsx` maneja errores de petición manualmente en cada catch. Falta uso consistente de `GlobalErrorBoundary` o un hook de API unificado que maneje toats de error globalmente.
7.  **Filtrado en Cliente**: `Folios.jsx` descarga *todos* los folios y filtra en cliente (Líneas 90-94). No escalable si crecen los pedidos. Paginación o filtro server-side necesario a futuro.
8.  **Api Instance vs Fetch**: Aunque `axios.js` está bien configurado, hay archivos (como `Dashboard.jsx` comentado) que sugieren inconsistencia en cómo se traen los datos.

### 🔵 Bajos (Visual/Clean Code)
9.  **Estilos CSS Inline/Híbridos**: Mezcla de Tailwind puro y componentes con estilos manuales (ej. `DeveloperDashboard` tiene estilos muy específicos hardcodeados).
10. **Comentarios de "TODO" y "Mock"**: Múltiples archivos tienen comentarios sobre código temporal que quedó fijo.

---

## 🛠️ 4. Estrategia de Mocking (Sin Backend)

Dado que **no podemos tocar el backend**, la estrategia para estabilizar el frontend es:

1.  **Crear Servicios Mock Oficiales**: Centralizar los mocks que están dispersos (ej. `mockOrders` en `Dashboard.jsx`) en `src/services/mocks`.
2.  **Interceptor de Modo Demo**: Configurar `axios.js` para que si `VITE_USE_MOCK=true`, intercepte ciertas rutas (`/dashboard/*`, `/folios`) y devuelva JSONs estáticos controlados, simulando latencia real.
3.  **No modificar Endpoints**: Mantener las URLs originales en los componentes (`api.get('/folios')`) y delegar la simulación a la capa de servicio/axios.

---

## 🚀 5. Orden de Ataque Sugerido

1.  **Unificar Loaders y EmptyStates**: Quick win visual. Reemplazar implementaciones inline por componentes compartidos.
2.  **Refactorizar Dashboard**: Extraer la lógica de fetch/mock a un hook `useDashboardStats` que decida si llamar a API o Mock, limpiando la vista.
3.  **Limpieza de `Folios.jsx`**: Usar el `EmptyState` compartido y extraer lógica de filtrado básica.
4.  **Resolver Dualidad DevDashboard**: Elegir uno (probablemente fusionar lo mejor de ambos) y borrar el otro.

---

**Archivos "Read-Only" (No modificar lógica core aún):**
- `src/context/AuthContext.jsx` (Lógica delicada de sesión).
- `src/api/axios.js` (Funciona bien, no romper).
