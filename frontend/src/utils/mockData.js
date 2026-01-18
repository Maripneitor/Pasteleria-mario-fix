export const mockStatistics = {
    revenue: {
        daily: 4500,
        weekly: 32000,
        monthly: 125000,
        growth: 12 // percentage
    },
    topFlavors: [
        { name: 'Tres Leches', count: 145, color: '#fca5a5' },
        { name: 'Chocolate Abuelita', count: 120, color: '#78350f' },
        { name: 'Vainilla Francesa', count: 90, color: '#fde047' },
        { name: 'Red Velvet', count: 65, color: '#991b1b' },
    ],
    ordersTrend: [65, 59, 80, 81, 56, 55, 40] // Weekly trend
};

export const mockInventory = [
    { id: 1, name: 'Harina de Trigo', stock: 45, unit: 'kg', minLevel: 20, status: 'ok' },
    { id: 2, name: 'Azúcar Refinada', stock: 12, unit: 'kg', minLevel: 15, status: 'low' },
    { id: 3, name: 'Chocolate Oscuro', stock: 8, unit: 'kg', minLevel: 5, status: 'ok' },
    { id: 4, name: 'Huevos', stock: 120, unit: 'pza', minLevel: 50, status: 'ok' },
    { id: 5, name: 'Vainilla', stock: 0.5, unit: 'lt', minLevel: 1, status: 'critical' },
    { id: 6, name: 'Fondant Blanco', stock: 25, unit: 'kg', minLevel: 10, status: 'ok' },
];

export const mockClients = [
    { id: 101, name: 'María Gómez', phone: '555-0101', orders: 12, lastOrder: '2023-10-15', tier: 'Gold' },
    { id: 102, name: 'Juan Pérez', phone: '555-0202', orders: 5, lastOrder: '2023-10-20', tier: 'Silver' },
    { id: 103, name: 'Carla Ruiz', phone: '555-0303', orders: 1, lastOrder: '2023-11-01', tier: 'Bronze' },
    { id: 104, name: 'Pastelería "El Panqué"', phone: '555-0404', orders: 45, lastOrder: '2023-11-02', tier: 'Platinum' },
    { id: 105, name: 'Roberto Díaz', phone: '555-0505', orders: 3, lastOrder: '2023-09-12', tier: 'Bronze' },
];
