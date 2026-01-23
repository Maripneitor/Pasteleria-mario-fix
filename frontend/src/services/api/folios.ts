import api from './client';
import { Folio, FolioStatus } from '@/types';

export const folioService = {
    // Obtener todos los folios
    getAllFolios: async (params?: {
        status?: FolioStatus;
        branchId?: number;
        startDate?: string;
        endDate?: string;
    }): Promise<Folio[]> => {
        const response = await api.get('/folios', { params });
        return response.data;
    },

    // Obtener un folio por ID
    getFolioById: async (id: number): Promise<Folio> => {
        const response = await api.get(`/folios/${id}`);
        return response.data;
    },

    // Crear nuevo folio
    createFolio: async (folioData: any): Promise<Folio> => {
        // any because Omit<Folio, 'id'...> might be too strict given the form flexibility
        const response = await api.post('/folios', folioData);
        return response.data;
    },

    // Actualizar folio
    updateFolio: async (id: number, updates: Partial<Folio>): Promise<Folio> => {
        const response = await api.put(`/folios/${id}`, updates);
        return response.data;
    },

    // Actualizar estado del folio
    updateFolioStatus: async (id: number, status: FolioStatus): Promise<Folio> => {
        const response = await api.patch(`/folios/${id}/status`, { status });
        return response.data;
    },

    // Eliminar folio
    deleteFolio: async (id: number): Promise<void> => {
        await api.delete(`/folios/${id}`);
    },

    // Generar PDF del folio
    generateFolioPDF: async (id: number): Promise<Blob> => {
        const response = await api.get(`/folios/${id}/pdf`, {
            responseType: 'blob',
        });
        return response.data;
    },
};

export default folioService;
