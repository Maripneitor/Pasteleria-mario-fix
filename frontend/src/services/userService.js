import api from '../api/axios';

// Función para actualizar Rol/Estatus/Dueño de usuario (Admin)
// Migrado desde services/api.js
export const updateUserRole = (id, data) => api.put(`/users/update-role/${id}`, data);

export default {
    updateUserRole
};
