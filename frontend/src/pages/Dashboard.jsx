import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StatsGrid from '../components/dashboard/StatsGrid'; // New container
import SalesChart from '../components/dashboard/SalesChart';
import FlavorChart from '../components/dashboard/FlavorChart';
import ActionableTable from '../components/dashboard/ActionableTable';
import { mockOrders } from '../utils/constants'; // Keep using mock data as base if API fails
import { calculateKPIData, groupOrdersByDate, calculateFlavorStats } from '../utils/analyticsHelpers';
import api from '../api/axios';

const Dashboard = () => {
    const { user, currentBranch } = useAuth();

    const [stats, setStats] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [flavorData, setFlavorData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleWhatsApp = (item) => {
        const phone = item.client?.phone || item.clientPhone; // Support both structures
        if (!phone) return alert('El cliente no tiene teléfono registrado.');

        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const clientName = item.client?.name || item.clientName || 'Cliente';
        // Handle array of flavors or string
        const flavor = Array.isArray(item.cakeFlavor) ? item.cakeFlavor.join(', ') : (item.cakeFlavor || 'Pastel');

        const message = `Hola ${clientName}, tu pedido #${item.folioNumber} de ${flavor} ya está listo para entrega en La Fiesta.`;
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
    };

    // Fetch data from backend
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/dashboard/daily-summary');
                const data = response.data;

                if (data.stats) {
                    setStats(data.stats);
                }

                if (data.recentOrders) {
                    // Map to ensure status colors
                    const mappedOrders = data.recentOrders.map(order => ({
                        ...order,
                        statusColor: order.status === 'Entregado' ? 'green' :
                            order.status === 'Pendiente' ? 'yellow' : 'gray'
                    }));
                    setRecentOrders(mappedOrders);

                    // Sales/Flavor data could also come from API
                    if (data.salesTrend) setSalesData(data.salesTrend);
                    if (data.flavorStats) setFlavorData(data.flavorStats);
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
                // Fallback to mock if API fails during dev/demo
                const orders = mockOrders;
                const kpis = calculateKPIData(orders);
                setStats([
                    { title: 'Ingresos Totales', value: `$${kpis.revenue}`, icon: 'DollarSign', trend: 'up', trendValue: '+2%', data: [] },
                    { title: 'Pedidos Activos', value: kpis.activeCount, icon: 'ShoppingBag', trend: 'up', trendValue: '+5', data: [] },
                    { title: 'Entregados', value: kpis.completedCount, icon: 'CheckCircle', trend: 'neutral', trendValue: '0%', data: [] },
                    { title: 'Pendientes', value: kpis.pendingCount, icon: 'Clock', trend: 'down', trendValue: '-1', data: [] }
                ]);
            } finally {
                setLoading(false);
            }
        };

        if (currentBranch) {
            fetchDashboardData();
        }
    }, [currentBranch]);

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                    Hola, {user?.username?.split(' ')[0] || 'Usuario'} 👋
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Centro de Gestión en {currentBranch?.name || 'la pastelería'}.
                </p>
            </div>

            {/* StatsGrid with Skeleton Loading */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            </div>
                            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <StatsGrid stats={stats} />
            )}

            {/* Charts Grid - Step B */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SalesChart data={salesData} />
                </div>
                <div className="lg:col-span-1">
                    <FlavorChart data={flavorData} />
                </div>
            </div>

            {/* Recent Activity / Actionable Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Orders Table - Takes up 2 columns */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Pedidos Recientes</h3>
                        <button className="text-sm font-medium text-bakery-primary hover:text-bakery-700">Ver todos</button>
                    </div>
                    <ActionableTable
                        data={recentOrders}
                        onEdit={(item) => console.log('Edit', item)}
                        onPrint={(item) => console.log('Print', item)}
                        onWhatsApp={handleWhatsApp}
                    />
                </div>

                {/* Right Column - Side Widgets */}
                <div className="space-y-6">
                    {/* Urgency / Alerts Widget */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20">
                        <h3 className="font-bold text-lg mb-2">Pedidos Urgentes</h3>
                        <p className="opacity-90 text-sm mb-4">Tienes 2 pedidos marcados como urgentes para hoy.</p>
                        <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-white/30 transition-all">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
