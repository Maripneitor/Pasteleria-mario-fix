# Guía de Copy UI y Micro-feedback

## Tono y Voz
- **Conciso**: Mensajes cortos y directos.
- **Humano**: Evitar tecnicismos (no "Error 500", sino "Algo salió mal").
- **Español Neutro**: Claro y profesional.

## Mensajes Estándar (Toasts / Feedback)

### Éxito (Success)
- **Creación**: "guardado correctamente."
- **Edición**: "actualizado correctamente."
- **Eliminación**: "eliminado correctamente."
- **Envío**: "enviado con éxito."

*Ejemplos:*
- "Usuario creado correctamente."
- "El pedido ha sido actualizado."

### Error (Error)
- **General**: "Ocurrió un error. Intenta nuevamente."
- **Conexión**: "Sin conexión. Verifica tu internet."
- **Validación**: "Revisa los campos marcados en rojo."
- **Permisos**: "No tienes permiso para realizar esta acción."

*Ejemplos:*
- "No se pudo guardar el usuario."
- "Error al conectar con el servidor."

### Advertencia (Warning)
- **Irreversible**: "¿Estás seguro? Esta acción no se puede deshacer."
- **Estado**: "La sesión expirará pronto."

## Modales de Confirmación

### Estructura
- **Título**: Acción a realizar (ej. "¿Eliminar usuario?").
- **Mensaje**: Consecuencia inmediata (ej. "Juan Pérez perderá acceso al sistema permanentemente.").
- **Botón Confirmar**: Verbo de acción + Objeto (ej. "Eliminar Usuario"). Color: `danger` o `primary`.
- **Botón Cancelar**: "Cancelar".

### Ejemplos Comunes
1. **Eliminar Elemento**
   - Título: "¿Eliminar [Elemento]?"
   - Mensaje: "Esta acción es irreversible."
   - Confirmar: "Eliminar"

2. **Salir sin Guardar**
   - Título: "¿Salir sin guardar?"
   - Mensaje: "Se perderán los cambios no guardados."
   - Confirmar: "Salir"
