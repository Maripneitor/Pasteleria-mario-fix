import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext'; // [SOCKET.IO] Import useSocket
import KPICard from '../../components/features/dashboard/KPICard';
import OrdersTable from '../../components/features/dashboard/OrdersTable';
import { mockStats, mockOrders } from '../../utils/constants';
import api from '../../services/api/client';

const ProgressBar = ({ status }) => {
    const levels = { pending: 'w-1/4 bg-yellow-400', preparing: 'w-2/4 bg-blue-500', ready: 'w-full bg-green-500', completed: 'w-full bg-gray-400' };
    return (
        <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${levels[status] || 'w-2/12 bg-gray-300'}`}></div>
        </div>
    );
};

const Dashboard = () => {
    // Keep auth hooks for permission checks if needed in future
    const { user, currentBranch, hasPermission } = useAuth();
    const socket = useSocket(); // [SOCKET.IO] Use hook

    const [stats, setStats] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // Fetch data from backend
    useEffect(() => {
        if (currentBranch) {
            fetchDashboardData();
        }
    }, [currentBranch]);

    // [SOCKET.IO] Listen for updates
    useEffect(() => {
        if (!socket) return;

        const handleUpdate = (data) => {
            // console.log('🔔 Dashboard Update Received:', data);
            fetchDashboardData();
        };

        socket.on('folio:created', handleUpdate);
        socket.on('folio:updated', handleUpdate);
        socket.on('folio:deleted', handleUpdate);

        return () => {
            socket.off('folio:created', handleUpdate);
            socket.off('folio:updated', handleUpdate);
            socket.off('folio:deleted', handleUpdate);
        };
    }, [socket, currentBranch]);

    return (
        <div className="space-y-8">
            {/* Header Section - WOW Factor */}
            <div className="bg-gradient-to-r from-bakery-600 to-indigo-600 rounded-2xl p-6 text-white mb-8 shadow-lg">
                <h2 className="text-3xl font-bold">¡Hola {user?.username || 'mariodep'}! 👋</h2>
                <p className="opacity-90 mt-2 text-lg">Este es el resumen de hoy. Tienes {orders.filter(o => o.isUrgent).length} pedidos urgentes esperando en producción.</p>
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
                        <p className="opacity-90 text-sm mb-4">Tienes {orders.filter(o => o.isUrgent).length} pedidos marcados como urgentes para hoy.</p>
                        <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
                            Ver Detalles
                        </button>
                    </div>

                    {/* Simple Activity Feed Placeholder */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Actividad Reciente</h3>
                        <div className="space-y-4">
                            {orders.length > 0 ? orders.slice(0, 5).map((order) => (
                                <div key={order.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-colors">
                                    <div className="flex gap-3 items-center mb-2">
                                        <div className="shrink-0 relative">
                                            {order.avatar ? (
                                                <img src={order.avatar} alt={order.customer} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm" />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${order.isUrgent ? 'bg-red-500' : 'bg-indigo-500'}`}>
                                                    {order.customer.charAt(0)}
                                                </div>
                                            )}
                                            {order.isUrgent && (
                                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {order.customer}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {order.items}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">${order.total}</p>
                                            <p className="text-[10px] text-gray-400">{order.time || 'Reciente'}</p>
                                        </div>
                                    </div>
                                    {/* Progress Bar */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <ProgressBar status={order.status} />
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-gray-400">{order.status}</span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-500">No hay actividad reciente.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
