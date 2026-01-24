import axios from 'axios';

// Crear instancia de Axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Solicitud (Request)
api.interceptors.request.use(
    (config) => {
        // 1. Inyectar Token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 2. Inyectar Branch-ID (Contexto de Tenancy)
        // Buscamos 'branchId' o 'current_branch_id' para compatibilidad
        const branchId = localStorage.getItem('branchId') || localStorage.getItem('current_branch_id');
        if (branchId) {
            config.headers['X-Branch-ID'] = branchId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de Respuesta (Response)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error.response ? error.response.status : null;

        // Manejo global de errores de autenticación
        if (status === 401) {
            console.warn("Sesión no autorizada o expirada.");
            // Opcional: Disparar evento de logout o redirigir
            // window.dispatchEvent(new CustomEvent('auth:logout'));
        }

        return Promise.reject(error);
    }
);

export default api;
