
# 🎂 Guía de Inicio: Pastelería La Fiesta

¡Bienvenido al equipo de desarrollo! Esta guía te ayudará a levantar el entorno de trabajo en pocos minutos usando **Docker**.

---

## 🛠️ Requisitos Previos
1. Tener **Docker** y **Docker Compose** instalados.
2. Tener el repositorio clonado localmente.
3. Abrir una terminal en la carpeta raíz del proyecto (puedes usar `Ctrl + ñ` en VS Code).

---

## 🐳 Gestión del Proyecto (Docker)

Sigue estos pasos en orden para encender los motores del proyecto.

### 1. Encendido y Construcción
Usa este comando la primera vez o cuando haya cambios en las librerías (`package.json`).
```bash
docker-compose up -d --build

```

> **Nota:** El parámetro `-d` corre todo en segundo plano para que puedas seguir usando tu terminal.

### 2. Configuración de Base de Datos (Solo 1 vez)

Debes ejecutar este comando para crear las tablas, roles y sucursales iniciales:

```bash
docker exec -it backend_pasteleria node scripts/migrate_to_multitenant.js

```

### 3. Limpieza Total (Reset)

Si necesitas borrar todo y empezar de cero (esto elimina clientes y pedidos registrados):

```bash
docker-compose down -v

```

---

## 🌿 Flujo de Trabajo con Git

Para evitar "romper" el código de otros, sigue siempre este ciclo:

1. **Sincronizar:** `git pull origin main` (Hazlo siempre antes de empezar a programar).
2. **Guardar:** `git add .` y luego `git commit -m "Explicación breve de tu cambio"`.
3. **Subir:** `git push origin main`.

---

## 🔗 Accesos Directos

Una vez que Docker esté corriendo, abre estas direcciones en tu navegador:

| Servicio | URL / Puerto |
| --- | --- |
| **🌍 Frontend (Web)** | [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) |
| **⚙️ Backend (API)** | [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) |
| **🗄️ MySQL** | Puerto: `3306` |

---

## 💡 Tips Rápidos

* **¿Cambiaste algo y no se ve reflejado?** Ejecuta `docker-compose up --build`.
* **¿Quieres ver errores del servidor?** Escribe `docker logs -f backend_pasteleria`.
* **Frontend en blanco:** Suele ser problema de caché de Docker; un `--build` lo soluciona el 99% de las veces.

```

