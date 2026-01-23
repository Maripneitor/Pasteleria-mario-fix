const { Folio, Payment, Client, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getDailySummary = async (req, res) => {
    try {
        const branchId = req.tenant.branchId; // Extraído del header X-Branch-ID por el middleware
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Calcular Ingresos Totales del Día (Abonos registrados hoy)
        const dailyRevenue = await Payment.sum('amount', {
            where: {
                createdAt: { [Op.gte]: today },
            },
            include: [{
                model: Folio,
                where: { branch_id: branchId },
                attributes: []
            }]
        }) || 0;

        // 2. Conteo de Pedidos Activos (No entregados ni cancelados)
        const activeOrders = await Folio.count({
            where: {
                branch_id: branchId,
                status: { [Op.notIn]: ['Entregado', 'Cancelado'] }
            }
        });

        // 3. Conteo de Pedidos Pendientes (Solo pendientes) - Agregado para KPI
        const pendingOrders = await Folio.count({
            where: {
                branch_id: branchId,
                status: 'Pendiente'
            }
        });

        // 4. Conteo de Entregas Hoy (Entregados hoy) - Agregado para KPI
        const completedToday = await Folio.count({
            where: {
                branch_id: branchId,
                status: 'Entregado',
                updatedAt: { [Op.gte]: today }
            }
        });


        // 5. Conteo de Clientes Nuevos del Mes
        const firstDayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const newClients = await Client.count({
            where: {
                branch_id: branchId,
                createdAt: { [Op.gte]: firstDayMonth }
            }
        });

        // 6. Obtener los últimos 5 pedidos para la OrdersTable
        const recentOrders = await Folio.findAll({
            where: { branch_id: branchId },
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: Client, as: 'client', attributes: ['name'] }]
        });

        // Mapear orders para el frontend
        const mappedOrders = recentOrders.map(order => ({
            id: order.folio_number || order.id,
            customer: order.client ? order.client.name : 'Cliente General',
            items: `${order.flavor_id} - ${order.filling_id}`, // Simplificado, idealmente un join con Flavor/Filling
            total: parseFloat(order.total_price),
            status: mapStatusToFrontend(order.status),
            isUrgent: new Date(order.delivery_date).toDateString() === new Date().toDateString(),
            time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        res.json({
            stats: {
                revenue: dailyRevenue,
                orders: activeOrders, // Total activos
                pendingCount: pendingOrders,
                completedCount: completedToday,
                clients: newClients,
            },
            recentOrders: mappedOrders
        });
    } catch (error) {
        console.error('Error en Dashboard Stats:', error);
        res.status(500).json({ message: 'Error al obtener resumen diario.' });
    }
};

// Helper para mapear status de BD a claves de UI
function mapStatusToFrontend(dbStatus) {
    const statusMap = {
        'Pendiente': 'pending',
        'En Proceso': 'preparing', // Asumiendo 'En Proceso' existe
        'En Ruta': 'delivery',
        'Entregado': 'completed',
        'Cancelado': 'cancelled'
    };
    return statusMap[dbStatus] || 'pending';
}
