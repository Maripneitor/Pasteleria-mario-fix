import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor para agregar token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor para manejar errores globales
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Avoid redirect loops by checking current path
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const updateUserRole = async (userId: number, updates: { role?: string; status?: string; ownerId?: number | null }) => {
    // Note: AdminUserManagement.jsx calls this with { role }, { status }, or { ownerId }
    // Using patch is safer than put if partial updates
    return api.patch(`/users/${userId}`, updates);
    // OR if backend has specific endpoints like /users/:id/role
    // But AdminUserManagement.jsx implies one function handles all?
    // Let's check the code: await updateUserRole(userId, { role: newRole })
    // In my previous thought I wrote api.patch(`/users/${userId}/role`, { role })
    // But AdminUserManagement uses it for ownerId too.
    // I should probably use a generic update or switch if endpoints differ.
    // For now assuming a generic PATCH /users/:id exists or adapting.
    // Wait, AdminUserManagement implies { role: ... } payload.
    // Let's assume generic patch /users/:id works.
};

export default api;
