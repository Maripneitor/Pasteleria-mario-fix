export const mockOwnerMetrics = {
    totalSales: 15400,
    orderCount: 42,
    pendingBalance: 3200,
    topProducts: [
        { name: 'Pastel Zanahoria', count: 12 },
        { name: 'ChocoFlan', count: 10 }
    ],
    recentOrders: [
        { id: '1', folio: 'F100', total: 500 },
        { id: '2', folio: 'F101', total: 800 }
    ]
};

export const mockDeveloperMetrics = {
    systemHealth: '98%',
    activeSessions: 5,
    errorLogs: 2,
    apiLatency: '45ms'
};

export const mockCashClose = {
    totalSales: 8560.50,
    totalAdvances: 2100.00,
    pendingBalance: 1450.00,
    orderCount: 15,
    ownerPhone: '525555555555',
    date: new Date().toISOString().split('T')[0]
};
