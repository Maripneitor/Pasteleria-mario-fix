# Agentes — Reglas de trabajo (Frontend only)

## Mandamientos (NO negociables)
1. NO tocar backend / NO cambiar endpoints / NO cambiar contratos API
2. NO romper RBAC/permisos
3. NO romper dark mode
4. PRs pequeños (300–500 líneas aprox), reversibles
5. No `window.alert()` / `confirm()` → usar ToastSystem

## Protocolo por tarea (formato obligatorio)
1) Diagnóstico (qué y dónde)
2) Propuesta (qué cambia y por qué)
3) Plan de implementación (pasos + archivos)
4) Criterios de aceptación (checklist)
5) QA steps (cómo probar manualmente)

## Roles
### Planner
- Convierte backlog en issues pequeños + define criterios de aceptación.

### Implementer
- Implementa SOLO lo especificado en el issue.
- Documenta supuestos (si algo es ambiguo).

### Reviewer
- Revisa consistencia visual, a11y, dark mode y duplicación.

### QA
- Ejecuta `docs/ui-qa-checklist.md` y reporta bugs con pasos.

## Plantillas

### Issue
Objetivo:
Pantalla/Componente:
Problema:
Solución propuesta:
Archivos:
Criterios de aceptación:
QA steps:
Riesgos:

### PR
Qué cambia:
Por qué:
Antes/Después:
Checklist: responsive / dark / a11y / states / RBAC / sin cambios API
Cómo probar:
