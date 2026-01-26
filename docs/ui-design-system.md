# Mini Design System — "La Fiesta" (Frontend only)

## Objetivo
Consistencia visual, accesibilidad, y dark mode estable usando tokens semánticos.
No introducir librerías nuevas si no son necesarias.

---

## Tokens (CSS variables)

### `src/index.css` (base)
Usar variables CSS para que Tailwind sea semántico:

- Primary (marca)
- Surface (fondos)
- Text
- Border
- Status (success/error/warning)

#### Light
- `--color-primary`
- `--color-surface`, `--color-surface-muted`, `--color-surface-overlay`
- `--color-text-main`, `--color-text-muted`
- `--color-border`
- `--color-success`, `--color-error`, `--color-warning`

#### Dark
Re-mapear variables dentro de `.dark { ... }` (sin cambiar clases).

---

## Tailwind mapping (semántico)
En `tailwind.config.js` mapear:

- `primary.DEFAULT`, `primary.foreground`
- `surface.DEFAULT`, `surface.muted`, `surface.overlay`
- `text.main`, `text.muted`
- `border`
- `status.success`, `status.error`, `status.warning`

**Regla:** en componentes nuevos NO usar HEX hardcoded. Usar tokens.

---

## Espaciado (escala)
Usar preferentemente: 4 / 8 / 12 / 16 / 24 / 32 px
Equivalencias Tailwind:
- 4px = `p-1`
- 8px = `p-2`
- 12px ≈ `p-3`
- 16px = `p-4`
- 24px = `p-6`
- 32px = `p-8`

---

## Tipografía (convención)
- Títulos: `text-lg` / `text-xl` + `font-semibold`
- Cuerpo: `text-sm` / `text-base`
- Ayuda/labels: `text-xs` / `text-sm` + `text-text-muted`

---

## Componentes base (UI atoms)

### Helper: `cn`
Ruta sugerida: `src/utils/cn.js`

**Regla:** componentes base NO deben depender de lógica de negocio.

---

### Button
**Variantes**
- `primary`
- `secondary`
- `ghost`
- `danger`

**Tamaños**
- `sm`, `md`, `lg`

**Estados**
- hover/active
- focus visible (ring)
- disabled
- loading (spinner + disabled)

---

### Input
**Props**
- `label`
- `error` (string)
- `...props` compatible con react-hook-form (forwardRef)

**Estados**
- normal
- focus visible
- error (`border-status-error`, `aria-invalid`)
- disabled

---

### Card
Contenedor estándar para módulos (dashboard/listas/modales).
- `Card`, `CardHeader`, `CardContent`

---

### Badge
Píldoras para estados:
- `default`, `success`, `warning`, `error`, `primary`

---

## Reglas de consistencia (obligatorias)
1. No `window.alert()` / `confirm()` para UX.
2. Todos los errores de API → Toast.
3. Inputs con error deben tener:
   - borde/estado visual
   - mensaje
   - `aria-invalid` + `aria-describedby`
4. Dark mode: ningún componente debe asumir fondos blancos.
5. PRs pequeños (300–500 líneas aprox) y reversibles.
