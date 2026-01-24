# Plantilla de Comandos: Pastelería La Fiesta

## 🐳 Gestión de Docker
Usa estos comandos para controlar el entorno de contenedores (Base de Datos, Backend y Frontend).

### Inicio rápido (en segundo plano):
```bash
docker-compose up -d
```

docker-compose up --build
```
### Apagar el servidor
```bash
docker-compose down

```bash
docker-compose down -v
```

### Ver logs en tiempo real (Backend):
```bash
docker logs -f backend_pasteleria
```

## 🔑 Configuración Post-Inicio (Multi-tenant)
Cada vez que limpies los volúmenes (-v) o inicies el proyecto por primera vez, debes ejecutar la migración para activar los permisos y las sucursales:

```bash
# Ejecutar migración de tablas y roles dentro del contenedor
docker exec -it backend_pasteleria node scripts/migrate_to_multitenant.js
```

## 🌿 Flujo de Trabajo con Git
Sigue este orden para mantener el repositorio sincronizado y evitar conflictos.

### Sincronizar cambios remotos:
```bash
git pull origin main
```

### Preparar y guardar cambios locales:
```bash
git add .
git commit -m "Descripción clara del cambio (ej: refactorizacion rbac frontend)"
```

### Subir al repositorio:
```bash
git push origin main
```

## 📋 Resumen de Puertos
- **Frontend (Vite)**: http://localhost:5173
- **Backend (API)**: http://localhost:3000
- **Base de Datos (MySQL)**: localhost:3306

> [!TIP]
> Recomendación para Desarrollador: Si el frontend se queda en blanco tras un cambio importante, usa siempre `docker-compose up --build` para asegurar que Docker no esté usando una versión vieja de tus archivos.