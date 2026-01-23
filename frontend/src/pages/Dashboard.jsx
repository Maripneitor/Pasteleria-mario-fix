import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import KPICard from '../components/dashboard/KPICard';
import OrdersTable from '../components/dashboard/OrdersTable';
import { mockStats, mockOrders } from '../utils/constants';
import api from '../services/api';

const Dashboard = () => {
    // Keep auth hooks for permission checks if needed in future
    const { user, currentBranch, hasPermission } = useAuth();

    const [stats, setStats] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from backend
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard/daily-summary');
                const { revenue, orders: activeOrders, pendingCount, completedCount } = response.data.stats;

                // Map backend stats to KPICard format
                const newStats = [
                    {
                        title: 'Ingresos Totales',
                        value: revenue,
                        prefix: '$',
                        icon: 'CurrencyDollarIcon',
                        color: 'text-indigo-600',
                        bg: 'bg-indigo-100'
                    },
                    {
                        title: 'Pedidos Hoy',
                        value: activeOrders, // Total Active (not completed/cancelled)
                        icon: 'ShoppingBagIcon',
                        color: 'text-pink-600',
                        bg: 'bg-pink-100'
                    },
                    {
                        title: 'Entregados',
                        value: completedCount || 0,
                        icon: 'CheckCircleIcon',
                        color: 'text-emerald-600',
                        bg: 'bg-emerald-100'
                    },
                    {
                        title: 'Pendientes',
                        value: pendingCount || 0,
                        icon: 'ClockIcon',
                        color: 'text-amber-600',
                        bg: 'bg-amber-100'
                    }
                ];

                setStats(newStats);
                setOrders(response.data.recentOrders);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
                // Fallback to mock data on error? Or just show empty/error state
                // using mock data for now if error, to keep UI usable in dev
                setStats(mockStats);
                setOrders(mockOrders);
            } finally {
                setLoading(false);
            }
        };

        if (currentBranch) {
            fetchDashboardData();
        }
    }, [currentBranch]);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Hola, {user?.username || 'Usuario'} 👋
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Aquí está el resumen de hoy en {currentBranch?.name || 'la pastelería'}.
                </p>
            </div>

            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <KPICard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        prefix={stat.prefix}
                        icon={stat.icon}
                        color={stat.color}
                        bg={stat.bg}
                    />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Orders Table - Takes up 2 columns */}
                <div className="lg:col-span-2">
                    <OrdersTable orders={orders} />
                </div>

                {/* Right Column - Placeholders for additional widgets */}
                <div className="space-y-6">
                    {/* Urgency / Alerts Widget Placeholder */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-2">Pedidos Urgentes</h3>
                        <p className="opacity-90 text-sm mb-4">Tienes 2 pedidos marcados como urgentes para hoy.</p>
                        <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
                            Ver Detalles
                        </button>
                    </div>

                    {/* Simple Activity Feed Placeholder */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Actividad Reciente</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shrink-0"></div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Nuevo pedido registrado</p>
                                        <p className="text-xs text-gray-400">Hace {i * 15} minutos</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
