import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Usar path relativo gracias al proxy de Vite
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token a cada petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // [DEV-ONLY] Capturar email en intentos de login para debugging
        if (config.url?.includes('/login') && config.method === 'post' && config.data?.email) {
            sessionStorage.setItem('debug_last_auth_email', config.data.email);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de RESPUESTA para manejar errores de sesión (AUTH_REQUIRED)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Disparar evento para SystemLogContext (incluso si no estamos en React Tree)
        if (error.response) {
            const isAuthError = error.response.status === 401 || error.response.status === 403;
            const event = new CustomEvent('system-log-event', {
                detail: {
                    level: isAuthError ? 'ERROR' : 'WARN', // Auth errors are critical/orange
                    message: `API Error: ${error.response.status} ${error.response.data?.code || ''}`,
                    data: {
                        url: error.config?.url,
                        status: error.response.status,
                        serverMessage: error.response.data?.message || 'Unknown error'
                    }
                }
            });
            window.dispatchEvent(event);
        }

        if (error.response && error.response.status === 401) {
            const data = error.response.data;
            if (data?.code === 'AUTH_REQUIRED') {
                console.warn("Sesión expirada o inválida. Ejecutando logout forzado.");
                // Limpieza manual ya que no podemos acceder al Context aquí fácilmente
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete api.defaults.headers.common['Authorization'];
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Función para actualizar Rol/Estatus/Dueño de usuario (Admin)
export const updateUserRole = (id, data) => api.put(`/users/update-role/${id}`, data);

export default api;
