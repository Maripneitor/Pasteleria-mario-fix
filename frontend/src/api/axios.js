import axios from 'axios';

// Crear instancia de Axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mock Control
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

// Interceptor de Solicitud (Request)
api.interceptors.request.use(
    (config) => {
        // 1. Inyectar Token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 2. Inyectar Branch-ID (Contexto de Tenancy)
        const branchId = localStorage.getItem('branchId') || localStorage.getItem('current_branch_id');
        if (branchId) {
            config.headers['X-Branch-ID'] = branchId;
        }

        // 3. Debugging (Dev Only)
        if (config.url?.includes('/login') && config.method === 'post' && config.data?.email) {
            sessionStorage.setItem('debug_last_auth_email', config.data.email);
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

        // System Logging for all API errors
        if (error.response) {
            const isAuthError = status === 401 || status === 403;
            const event = new CustomEvent('system-log-event', {
                detail: {
                    level: isAuthError ? 'ERROR' : 'WARN',
                    message: `API Error: ${status} ${error.response.data?.code || ''}`,
                    data: {
                        url: error.config?.url,
                        status: status,
                        serverMessage: error.response.data?.message || 'Unknown error'
                    }
                }
            });
            window.dispatchEvent(event);
        }

        // Manejo Visual de Errores (Toast)
        if (status === 403) {
            window.dispatchEvent(new CustomEvent('toast-message', {
                detail: {
                    type: 'error',
                    title: 'Acceso Denegado',
                    message: 'No tienes permiso para realizar esta acción o acceder a este recurso.'
                }
            }));
        }

        // Manejo global de errores de autenticación (401)
        if (status === 401) {
            const data = error.response?.data;
            if (data?.code === 'AUTH_REQUIRED' || Number(status) === 401) {
                console.warn("Sesión expirada o inválida. Ejecutando logout forzado.");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // TODO: Use a more robust way to clear auth if needed, but this matches previous logic
                window.location.href = '/login';
            }
        }

        // Fallback a Mocks si falla la red y estamos en modo híbrido/allow-mocks
        // Nota: La lógica de fallback se manejará mejor en el nivel de servicio o adapter
        // pero aquí devolvemos el error para que sea capturado.

        return Promise.reject(error);
    }
);

// Helper para reintentos o fallbacks (usado por los servicios)
export const withFallback = async (apiCall, mockData) => {
    if (USE_MOCKS) {
        console.log('[MOCK] Returning mock data directly.');
        // Simular delay de red
        await new Promise(r => setTimeout(r, 600));
        return { data: mockData };
    }

    try {
        return await apiCall();
    } catch (error) {
        console.warn('[API] Request failed, checking for fallback...', error.message);
        // Si falla por red y tenemos mockData, usamos el fallback
        if (!error.response || error.code === 'ERR_NETWORK') {
            console.log('[MOCK] Serving fallback data due to network error.');
            window.dispatchEvent(new CustomEvent('toast-message', {
                detail: {
                    type: 'warning',
                    title: 'Modo Offline',
                    message: 'No se pudo conectar con el servidor. Mostrando datos simulados.'
                }
            }));
            return { data: mockData };
        }
        throw error;
    }
};

export default api;
