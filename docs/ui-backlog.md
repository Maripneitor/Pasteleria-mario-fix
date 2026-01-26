# UI/UX Backlog — Pastelería La Fiesta (Frontend only)

## Restricciones (NO negociables)
- NO tocar backend
- NO cambiar endpoints / contratos de API
- NO romper RBAC/permisos
- NO romper dark mode
- PRs pequeños y reversibles

---

## P0 — Crítico (UX/Errores/A11y)
### P0.1 Erradicar `window.alert()` (Login/FolioForm/Kanban)
**Impacto:** Muy alto  
**Esfuerzo:** Bajo  
**Riesgo:** Bajo  
**Pantallas:** Login, FolioForm, KanbanBoard  
**Criterios de aceptación**
- Cero ocurrencias de `alert()` o `confirm()` en el repo
- Errores API se muestran en Toast (error)
- Éxitos API se muestran en Toast (success)

### P0.2 Feedback semántico en formularios (errores visuales + aria)
**Impacto:** Alto  
**Esfuerzo:** Medio  
**Riesgo:** Bajo  
**Pantallas:** FolioForm (+ inputs reutilizables)  
**Criterios de aceptación**
- Inputs con error: `border-status-error` + `ring` en focus
- Mensaje de error visible + `aria-invalid="true"`
- `aria-describedby` apunta al mensaje de error

### P0.3 Estados de submit (evitar doble envío)
**Impacto:** Alto  
**Esfuerzo:** Bajo  
**Riesgo:** Bajo  
**Pantallas:** Login, FolioForm  
**Criterios de aceptación**
- Botón submit muestra `loading` y queda deshabilitado durante request
- No hay dobles creaciones por doble click

---

## P1 — Alto (Consistencia + móvil + UX pro)
### P1.1 Bandeja IA en móvil (Drawer)
**Impacto:** Alto  
**Esfuerzo:** Medio  
**Riesgo:** Medio (Layout)  
**Pantallas:** Layout, AiSidebar  
**Criterios de aceptación**
- En < `lg`, IA se abre como Drawer con overlay
- Botón flotante visible en móvil sin tapar acciones críticas

### P1.2 Optimistic UI en Kanban (React Query mutation + rollback)
**Impacto:** Alto  
**Esfuerzo:** Alto  
**Riesgo:** Medio  
**Pantallas:** KanbanBoard  
**Criterios de aceptación**
- La tarjeta se mueve instantáneamente (sin esperar server)
- Si falla API → rollback automático + toast de error

### P1.3 Tokens semánticos (evitar HEX hardcodeados)
**Impacto:** Medio  
**Esfuerzo:** Alto  
**Riesgo:** Bajo  
**Pantallas:** Global  
**Criterios de aceptación**
- No usar colores HEX hardcoded en componentes nuevos
- Usar `bg-surface`, `text-text-main`, `border-border`, etc.
- Contraste AA en light/dark

---

## P2 — Pulido (percepción + consistencia + delighters)
### P2.1 Skeleton loading unificado
**Impacto:** Medio  
**Esfuerzo:** Medio  
**Riesgo:** Bajo  
**Pantallas:** Dashboard, FolioList  
**Criterios de aceptación**
- Listados usan skeletons consistentes
- Loader full-screen solo para acciones bloqueantes (si aplica)

### P2.2 Drop zone “sticky” en Kanban
**Impacto:** Bajo  
**Esfuerzo:** Bajo  
**Riesgo:** Bajo  
**Pantallas:** KanbanColumn  
**Criterios de aceptación**
- Al arrastrar, columna destino se ilumina
- Área efectiva de drop = 100% altura de columna

### P2.3 Transiciones de página (framer-motion)
**Impacto:** Bajo  
**Esfuerzo:** Medio  
**Riesgo:** Medio  
**Pantallas:** Layout / Router  
**Criterios de aceptación**
- Transición suave 150–250ms
- Header/sidebar permanecen estables
