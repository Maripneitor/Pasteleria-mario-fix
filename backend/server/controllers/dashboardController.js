const { Folio, User, FolioEditHistory, sequelize, SystemLog } = require('../models');
const { Op } = require('sequelize');
const { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, differenceInHours } = require('date-fns');

// In-memory store for simple metrics (reset on restart)
let errorCount = 0;
// Example: Middleware could increment this. For now, we'll increment on errors caught in this controller.

exports.getOwnerMetrics = async (req, res) => {
    try {
        const today = new Date();
        const startWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
        const endWeek = endOfWeek(today, { weekStartsOn: 1 });
        const startMonth = startOfMonth(today);
        const endMonth = endOfMonth(today);

        // 1. Weekly Sales (Line/Bar Chart data)
        // Group by day of week
        const foliosThisWeek = await Folio.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startWeek, endWeek]
                },
                status: { [Op.ne]: 'Cancelado' }
            },
            attributes: ['createdAt', 'total']
        });

        const salesByDay = {
            'Lunes': 0, 'Martes': 0, 'Miércoles': 0, 'Jueves': 0, 'Viernes': 0, 'Sábado': 0, 'Domingo': 0
        };

        foliosThisWeek.forEach(f => {
            const dayName = format(f.createdAt, 'EEEE', { locale: require('date-fns/locale/es') });
            // Capitalize first letter
            const key = dayName.charAt(0).toUpperCase() + dayName.slice(1);
            if (salesByDay[key] !== undefined) {
                salesByDay[key] += parseFloat(f.total || 0);
            }
        });

        const weeklySalesData = Object.keys(salesByDay).map(day => ({
            name: day,
            ventas: salesByDay[day]
        }));


        // 2. Baker of the Month (Ranking) - Enhanced
        // Get folios for the month to calculate stats manually (sequalize grouping with complex logic is hard)
        const monthlyFolios = await Folio.findAll({
            where: {
                createdAt: { [Op.between]: [startMonth, endMonth] },
                status: { [Op.in]: ['Entregado', 'Listo para Entrega'] },
                responsibleUserId: { [Op.ne]: null }
            },
            include: [
                { model: User, as: 'responsibleUser', attributes: ['id', 'username'] },
                { model: FolioEditHistory, as: 'editHistory', attributes: ['id'] } // Just count ids
            ],
            attributes: ['id', 'total', 'createdAt', 'updatedAt', 'responsibleUserId']
        });

        const bakerStats = {};

        monthlyFolios.forEach(f => {
            const uid = f.responsibleUserId;
            if (!uid) return;
            const userName = f.responsibleUser ? f.responsibleUser.username : 'Desconocido';

            if (!bakerStats[uid]) {
                bakerStats[uid] = {
                    name: userName,
                    folios: 0,
                    sales: 0,
                    totalHours: 0,
                    perfectFolios: 0
                };
            }

            // Sales & Count
            bakerStats[uid].folios += 1;
            bakerStats[uid].sales += parseFloat(f.total || 0);

            // Time (Hours from create to last update)
            const hours = differenceInHours(new Date(f.updatedAt), new Date(f.createdAt));
            bakerStats[uid].totalHours += (hours > 0 ? hours : 0);

            // Perfect Rate (Assuming <= 3 edits means standard flow: Create->Prod->Listo->Entregado)
            // If edits > 3, likely corrections were made.
            const editCount = f.editHistory ? f.editHistory.length : 0;
            if (editCount <= 3) {
                bakerStats[uid].perfectFolios += 1;
            }
        });

        // Convert to array and calculate averages
        const formattedRanking = Object.values(bakerStats).map(b => ({
            name: b.name,
            folios: b.folios,
            sales: b.sales,
            avgTime: b.folios > 0 ? Math.round(b.totalHours / b.folios) : 0,
            perfectRate: b.folios > 0 ? Math.round((b.perfectFolios / b.folios) * 100) : 0
        })).sort((a, b) => b.folios - a.folios).slice(0, 5); // Sort by folios, top 5


        // 3. Balance (Income vs Advances/Pending)
        const allActiveFolios = await Folio.findAll({
            where: { status: { [Op.ne]: 'Cancelado' } },
            attributes: ['total', 'advancePayment', 'balance']
        });

        let totalExpected = 0;
        let totalCollected = 0;
        let totalPending = 0;

        allActiveFolios.forEach(f => {
            const t = parseFloat(f.total || 0);
            const bal = parseFloat(f.balance || 0);
            totalExpected += t;
            totalPending += bal;
            totalCollected += (t - bal);
        });

        res.json({
            weeklySales: weeklySalesData,
            bakerRanking: formattedRanking,
            financials: {
                expected: totalExpected,
                collected: totalCollected,
                pending: totalPending
            }
        });

    } catch (error) {
        console.error('Error getting owner metrics:', error);
        errorCount++;
        res.status(500).json({ message: 'Error retrieving owner metrics' });
    }
};

exports.getDeveloperMetrics = async (req, res) => {
    try {
        // 1. Database Status
        let dbStatus = 'Unknown';
        let dbResponseTime = 0;
        const start = Date.now();
        try {
            await sequelize.authenticate();
            dbStatus = 'Connected';
            dbResponseTime = Date.now() - start;
        } catch (e) {
            dbStatus = 'Disconnected';
            errorCount++;
        }

        // 2. System Info
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();

        // 3. Mock Latency History (Simulated for visualization)
        // In a real app, use a time-series DB or logs.
        const mockLatencyHistory = Array.from({ length: 20 }, (_, i) => ({
            time: `T-${20 - i}s`,
            latency: Math.floor(Math.random() * 150) + 50 // Random 50-200ms
        }));

        res.json({
            system: {
                uptime: uptime,
                memory: {
                    rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
                    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
                    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB'
                }
            },
            database: {
                status: dbStatus,
                latency: dbResponseTime
            },
            errors: {
                count: errorCount // This is a simple counter since restart
            },
            latencyHistory: mockLatencyHistory
        });

    } catch (error) {
        console.error('Error getting developer metrics:', error);
        res.status(500).json({ message: 'Error retrieving developer metrics' });
    }
};

exports.getDailySummary = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const user = req.user;
        let whereClause = {
            createdAt: {
                [Op.between]: [startOfDay, endOfDay]
            },
            status: { [Op.ne]: 'Cancelado' }
        };

        // --- FILTRO MULTI-TENANCY ---
        if (user.role === 'Dueño') {
            const myEmployees = await User.findAll({
                where: { [Op.or]: [{ ownerId: user.id }, { id: user.id }] },
                attributes: ['id']
            });
            const allowedIds = myEmployees.map(u => u.id);
            whereClause.responsibleUserId = { [Op.in]: allowedIds };
        } else if (user.role === 'Empleado') {
            if (user.ownerId) {
                const sameBranchUsers = await User.findAll({
                    where: { [Op.or]: [{ ownerId: user.ownerId }, { id: user.ownerId }] },
                    attributes: ['id']
                });
                const allowedIds = sameBranchUsers.map(u => u.id);
                whereClause.responsibleUserId = { [Op.in]: allowedIds };
            } else {
                whereClause.responsibleUserId = user.id;
            }
        } // Si es Admin, no aplica filtro extra

        // 1. Folios CREATED today (Anticipos de nuevos pedidos)
        const createdFolios = await Folio.findAll({
            where: whereClause
        });

        // 2. Folios DELIVERED today (Saldos cobrados al entregar)
        // Usamos la misma cláusula de usuario/segregación, pero cambiamos el filtro de fecha/status
        const deliveryWhereClause = { ...whereClause };
        delete deliveryWhereClause.createdAt; // Quitar filtro de creación

        // Asumimos que deliveryDate se guarda como YYYY-MM-DD string o DATEONLY
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        deliveryWhereClause.deliveryDate = todayStr;
        // Solo contar saldos de folios no cancelados (ya está en whereClause base)

        const deliveredFolios = await Folio.findAll({
            where: deliveryWhereClause
        });

        let totalSalesTodayMatches = 0; // Total de lo vendido hoy (creado hoy)
        let totalAdvancesToday = 0; // Dinero entrante por anticipos hoy
        let totalBalancesCollectedToday = 0; // Dinero entrante por entregas hoy

        createdFolios.forEach(folio => {
            totalSalesTodayMatches += parseFloat(folio.total || 0);
            totalAdvancesToday += parseFloat(folio.advancePayment || 0);
        });

        deliveredFolios.forEach(folio => {
            // Nota: Si un pastel se crea Y se entrega hoy, su anticipo se suma arriba
            // y su saldo se suma aquí. Total = anticipo + saldo. Correcto.
            totalBalancesCollectedToday += parseFloat(folio.balance || 0);
        });

        const pendingBalanceTotal = createdFolios.reduce((acc, f) => acc + parseFloat(f.balance || 0), 0);

        const summary = {
            date: format(new Date(), 'dd/MM/yyyy', { locale: require('date-fns/locale/es') }),
            totalSales: totalSalesTodayMatches,
            totalAdvances: totalAdvancesToday,
            pendingBalance: pendingBalanceTotal,
            // Ingreso Real = Anticipos recibidos hoy + Saldos cobrados de entregas hoy
            realIncome: totalAdvancesToday + totalBalancesCollectedToday
        };

        res.json(summary);

    } catch (error) {
        console.error('Error getting daily summary:', error);
        res.status(500).json({ message: 'Error retrieving daily summary' });
    }
};

// --- ADMIN GLOBAL ANALYTICS ---

exports.getGlobalSales = async (req, res) => {
    try {
        const owners = await User.findAll({
            where: { role: 'Dueño' },
            attributes: ['id', 'username']
        });

        const salesData = [];

        for (const owner of owners) {
            // Get all user IDs belonging to this owner branch
            const branchUsers = await User.findAll({
                where: {
                    [Op.or]: [
                        { id: owner.id },
                        { ownerId: owner.id }
                    ]
                },
                attributes: ['id']
            });
            const ids = branchUsers.map(u => u.id);

            // Sum total sales for this branch
            // We'll aggregate all time for now, or maybe last 30 days
            const totalSales = await Folio.sum('total', {
                where: {
                    responsibleUserId: { [Op.in]: ids },
                    status: { [Op.ne]: 'Cancelado' }
                }
            });

            salesData.push({
                name: owner.username,
                ventas: totalSales || 0,
                id: owner.id
            });
        }

        res.json(salesData.sort((a, b) => b.ventas - a.ventas));

    } catch (error) {
        console.error('Error getting global sales:', error);
        res.status(500).json({ message: 'Error retrieving global sales' });
    }
};

exports.getTenants = async (req, res) => {
    try {
        const owners = await User.findAll({
            where: { role: 'Dueño' },
            attributes: ['id', 'username', 'email', 'dashboardConfig', 'status', 'createdAt']
        });
        res.json(owners);
    } catch (error) {
        console.error('Error getting tenants:', error);
        res.status(500).json({ message: 'Error retrieving tenants' });
    }
};

exports.updateTenantFeatures = async (req, res) => {
    try {
        const { id } = req.params;
        const { features } = req.body; // { enableTorch: true, enableQR: false }

        const owner = await User.findByPk(id);
        if (!owner) {
            return res.status(404).json({ message: 'Dueño no encontrado' });
        }

        // Merge with existing config
        const currentConfig = owner.dashboardConfig || {};
        const newConfig = { ...currentConfig, features: { ...currentConfig.features, ...features } };

        await owner.update({ dashboardConfig: newConfig });

        // Log action
        await SystemLog.create({
            level: 'info',
            section: 'Admin',
            message: `Funcionalidades actualizadas para ${owner.username}`,
            meta: { adminId: req.user.id, targetId: id, changes: features }
        });

        res.json({ message: 'Configuración actualizada', config: newConfig });

    } catch (error) {
        console.error('Error updating tenant features:', error);
        res.status(500).json({ message: 'Error updating features' });
    }
};

exports.getSecurityLogs = async (req, res) => {
    try {
        const logs = await SystemLog.findAll({
            order: [['createdAt', 'DESC']],
            limit: 100 // Last 100 logs
        });
        res.json(logs);
    } catch (error) {
        console.error('Error getting security logs:', error);
        res.status(500).json({ message: 'Error retrieving logs' });
    }
};
