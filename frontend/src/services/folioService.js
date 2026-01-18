import api from './api';

const folioService = {
    // Obtener todos los folios (con filtros opcionales)
    getAllFolios: async (params = {}) => {
        try {
            const response = await api.get('/folios', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching folios:', error);
            throw error;
        }
    },

    // Obtener un folio por ID
    getFolioById: async (id) => {
        try {
            const response = await api.get(`/folios/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching folio ${id}:`, error);
            throw error;
        }
    },

    // Crear un nuevo folio
    createFolio: async (folioData) => {
        try {
            const response = await api.post('/folios', folioData);
            return response.data;
        } catch (error) {
            console.error('Error creating folio:', error);
            throw error;
        }
    },

    // Actualizar un folio existente
    updateFolio: async (id, folioData) => {
        try {
            const response = await api.put(`/folios/${id}`, folioData);
            return response.data;
        } catch (error) {
            console.error(`Error updating folio ${id}:`, error);
            throw error;
        }
    },

    // Actualizar solo el estado (patch)
    updateFolioStatus: async (id, statusData) => {
        try {
            // statusData puede ser { status: 'Nuevo' } o { isPrinted: true }, etc.
            const response = await api.patch(`/folios/${id}/status`, statusData);
            return response.data;
        } catch (error) {
            console.error(`Error updating status for folio ${id}:`, error);
            throw error;
        }
    },

    // Cancelar folio
    cancelFolio: async (id) => {
        try {
            const response = await api.patch(`/folios/${id}/cancel`);
            return response.data;
        } catch (error) {
            console.error(`Error cancelling folio ${id}:`, error);
            throw error;
        }
    }
};

export default folioService;
