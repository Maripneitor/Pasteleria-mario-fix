import { useQuery } from '@tanstack/react-query';

// Mock Data for consistent demo without backend dependency for this features
const mockInventory = [
    { id: 1, name: 'Harina de Trigo', availableStock: 45.5, minLevel: 20, unit: 'kg', status: 'ok' },
    { id: 2, name: 'Azúcar Refinada', availableStock: 12.0, minLevel: 15, unit: 'kg', status: 'low' },
    { id: 3, name: 'Huevos', availableStock: 150, minLevel: 100, unit: 'pza', status: 'ok' },
    { id: 4, name: 'Mantequilla', availableStock: 4.5, minLevel: 8, unit: 'kg', status: 'critical' },
    { id: 5, name: 'Chocolate Oscuro', availableStock: 8.0, minLevel: 5, unit: 'kg', status: 'ok' },
    { id: 6, name: 'Vainilla', availableStock: 0.8, minLevel: 1, unit: 'L', status: 'low' },
];

export const useInventory = () => {
    return useQuery({
        queryKey: ['inventory'],
        queryFn: async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            return mockInventory;
        },
        staleTime: 60000,
    });
};
