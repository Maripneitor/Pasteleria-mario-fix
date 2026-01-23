export const mockStats = [
    {
        title: 'Ingresos Totales',
        value: 14500.50,
        prefix: '$',
        icon: 'CurrencyDollarIcon',
        color: 'text-indigo-600',
        bg: 'bg-indigo-100'
    },
    {
        title: 'Pedidos Hoy',
        value: 24,
        icon: 'ShoppingBagIcon',
        color: 'text-pink-600',
        bg: 'bg-pink-100'
    },
    {
        title: 'Entregados',
        value: 18,
        icon: 'CheckCircleIcon',
        color: 'text-emerald-600',
        bg: 'bg-emerald-100'
    },
    {
        title: 'Pendientes',
        value: 6,
        icon: 'ClockIcon',
        color: 'text-amber-600',
        bg: 'bg-amber-100'
    }
];

export const mockOrders = [
    {
        id: 'ORD-001',
        customer: 'Juan Pérez',
        avatar: 'https://i.pravatar.cc/150?u=juan',
        items: 'Pastel de Chocolate, 2 Cupcakes',
        total: 450.00,
        status: 'pending', // pending, preparing, delivery, completed, cancelled
        isUrgent: true,
        time: '10:30 AM'
    },
    {
        id: 'ORD-002',
        customer: 'María López',
        avatar: 'https://i.pravatar.cc/150?u=maria',
        items: 'Pastel de Tres Leches',
        total: 380.00,
        status: 'completed',
        isUrgent: false,
        time: '09:15 AM'
    },
    {
        id: 'ORD-003',
        customer: 'Carlos Ruiz',
        avatar: 'https://i.pravatar.cc/150?u=carlos',
        items: 'Docena de Donas',
        total: 180.00,
        status: 'delivery',
        isUrgent: false,
        time: '11:00 AM'
    },
    {
        id: 'ORD-004',
        customer: 'Ana García',
        avatar: 'https://i.pravatar.cc/150?u=ana',
        items: 'Pastel de Zanahoria',
        total: 420.00,
        status: 'preparing',
        isUrgent: true,
        time: '11:45 AM'
    },
    {
        id: 'ORD-005',
        customer: 'Roberto Díaz',
        avatar: 'https://i.pravatar.cc/150?u=roberto',
        items: 'Pay de Limón',
        total: 250.00,
        status: 'cancelled',
        isUrgent: false,
        time: '08:45 AM'
    }
];
