export const mockFolios = [
    {
        id: 'mock-1',
        folioNumber: 'M001',
        clientName: 'Cliente Mock 1',
        clientPhone: '555-0001',
        deliveryDate: new Date().toISOString(),
        total: 500,
        status: 'Pendiente',
        cakeFlavor: ['Vainilla'],
        persons: 10
    },
    {
        id: 'mock-2',
        folioNumber: 'M002',
        clientName: 'Cliente Mock 2',
        clientPhone: '555-0002',
        deliveryDate: new Date().toISOString(),
        total: 1200,
        status: 'Horneado',
        cakeFlavor: ['Chocolate'],
        persons: 20
    },
    {
        id: 'mock-3',
        folioNumber: 'M003',
        clientName: 'Cliente Mock 3',
        clientPhone: '555-0003',
        deliveryDate: new Date().toISOString(),
        total: 800,
        status: 'Entregado',
        cakeFlavor: ['Fresa'],
        persons: 15
    }
];

export const mockFolioDetails = {
    ...mockFolios[0],
    description: "Detalles completos del pastel simulado.",
    flavors: ["Vainilla", "Fresa"],
    filling: "Queso Crema",
    decoration: "Merengue"
};
