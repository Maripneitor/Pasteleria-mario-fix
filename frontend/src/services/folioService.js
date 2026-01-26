import api, { withFallback } from '../api/axios';
import { mockFolios, mockFolioDetails } from '../mocks/folios.fixtures';

const folioService = {
    // Obtener todos los folios (con filtros opcionales)
    getAllFolios: async (params = {}) => {
        return withFallback(
            () => api.get('/folios', { params }),
            mockFolios
        ).then(res => res.data);
    },

    // Obtener un folio por ID
    getFolioById: async (id) => {
        return withFallback(
            () => api.get(`/folios/${id}`),
            { ...mockFolioDetails, id }
        ).then(res => res.data);
    },

    // Crear un nuevo folio
    createFolio: async (folioData) => {
        return withFallback(
            () => api.post('/folios', folioData),
            { ...folioData, id: 'mock-new-' + Date.now(), folioNumber: 'M-NEW' }
        ).then(res => res.data || res);
    },

    // Actualizar un folio existente
    updateFolio: async (id, folioData) => {
        return withFallback(
            () => api.put(`/folios/${id}`, folioData),
            { ...folioData, id }
        ).then(res => res.data || res);
    },

    // Actualizar solo el estado (patch)
    updateFolioStatus: async (id, statusData) => {
        return withFallback(
            () => api.patch(`/folios/${id}/status`, statusData),
            { id, ...statusData, status: statusData.status || 'Updated' }
        ).then(res => res.data || res);
    },

    // Cancelar folio
    cancelFolio: async (id) => {
        return withFallback(
            () => api.patch(`/folios/${id}/cancel`),
            { id, status: 'Cancelado' }
        ).then(res => res.data || res);
    }
};

export default folioService;
