import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StatsGrid from '../components/dashboard/StatsGrid'; // New container
import SalesChart from '../components/dashboard/SalesChart';
import FlavorChart from '../components/dashboard/FlavorChart';
import ActionableTable from '../components/dashboard/ActionableTable';
import { mockOrders } from '../utils/constants'; // Keep using mock data as base if API fails
import { calculateKPIData, groupOrdersByDate, calculateFlavorStats } from '../utils/analyticsHelpers';
// import api from '../services/api';

const Dashboard = () => {
    const { user, currentBranch } = useAuth();

    const [stats, setStats] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [flavorData, setFlavorData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    // const [loading, setLoading] = useState(true);

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
                // Ideally fetch full list or robust summary. 
                // For demo of "Real Data Helpers", let's assume we get a list of orders 
                // or use mockOrders if API response is limited.

                // const response = await api.get('/folios'); // fetching full list for analytics
                // const orders = response.data;

                // FALLBACK: Use Mock Orders to demonstrate the Helpers logic clearly without breaking if API is empty
                const orders = mockOrders;

                // Process Data using Helpers
                const kpis = calculateKPIData(orders);
                const salesTrend = groupOrdersByDate(orders);
                const flavorDist = calculateFlavorStats(orders);

                // Map KPIs to HeroCard format
                const newStats = [
                    {
                        title: 'Ingresos Totales',
                        value: `$${kpis.revenue.toLocaleString()}`,
                        icon: 'DollarSign',
                        trend: 'up',
                        trendValue: '+2%', // Mock trend for now
                        data: salesTrend.map(d => d.sales)
                    },
                    {
                        title: 'Pedidos Activos',
                        value: kpis.activeCount,
                        icon: 'ShoppingBag',
                        trend: 'up',
                        trendValue: '+5',
                        data: [5, 8, 12, 15, 20, 18, kpis.activeCount]
                    },
                    {
                        title: 'Entregados',
                        value: kpis.completedCount,
                        icon: 'CheckCircle',
                        trend: 'neutral',
                        trendValue: '0%',
                        data: [10, 12, 15, 12, 18, 20, kpis.completedCount]
                    },
                    {
                        title: 'Pendientes',
                        value: kpis.pendingCount,
                        icon: 'Clock',
                        trend: 'down',
                        trendValue: '-1',
                        data: [8, 6, 5, 8, 4, 3, kpis.pendingCount]
                    }
                ];

                setStats(newStats);
                setSalesData(salesTrend);
                setFlavorData(flavorDist);
                setRecentOrders(orders.slice(0, 5).map(o => ({ ...o, folioNumber: o.id || '009' })));

            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                // setLoading(false);
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

            {/* Stats Grid Wrapper - Step A */}
            <StatsGrid stats={stats} />

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
