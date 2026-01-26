import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockOrders } from '../utils/constants'; // Backup mock data
import { calculateKPIData } from '../utils/analyticsHelpers';
import api from '../api/axios';

// New Components
import QuickActions from '../components/dashboard/QuickActions';
import OwnerWidgets from '../components/dashboard/widgets/OwnerWidgets';
import EmployeeWidgets from '../components/dashboard/widgets/EmployeeWidgets';
import ActionableTable from '../components/dashboard/ActionableTable';

const Dashboard = () => {
    const { user, currentBranch, hasPermission } = useAuth();

    const [stats, setStats] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [flavorData, setFlavorData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const isOwnerOrAdmin = hasPermission('admin.access') || hasPermission('owners.manage') || user?.role === 'Dueño' || user?.role === 'Administrador' || user?.role === 'developer';

    const handleWhatsApp = (item) => {
        const phone = item.client?.phone || item.clientPhone;
        if (!phone) return alert('El cliente no tiene teléfono registrado.');

        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const clientName = item.client?.name || item.clientName || 'Cliente';
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
                // Simulate API call for now if real endpoint fails or use mock logic
                // const response = await api.get('/dashboard/daily-summary');
                // const data = response.data;

                // Using Mock/Simulation logic to ensure UI renders nicely during Refactor
                await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

                const kpis = calculateKPIData(mockOrders);
                setStats([
                    { title: 'Ingresos Totales', value: `$${kpis.revenue}`, icon: 'DollarSign', trend: 'up', trendValue: '+2%', data: [] },
                    { title: 'Pedidos Activos', value: kpis.activeCount, icon: 'ShoppingBag', trend: 'up', trendValue: '+5', data: [] },
                    { title: 'Entregados', value: kpis.completedCount, icon: 'CheckCircle', trend: 'neutral', trendValue: '0%', data: [] },
                    { title: 'Pendientes', value: kpis.pendingCount, icon: 'Clock', trend: 'down', trendValue: '-1', data: [] }
                ]);

                setRecentOrders(mockOrders.map(o => ({
                    ...o,
                    statusColor: o.status === 'Entregado' ? 'green' : o.status === 'Pendiente' ? 'yellow' : 'gray'
                })));

                // Mock Chart Data
                setSalesData([
                    { name: 'Lun', ventas: 4000 }, { name: 'Mar', ventas: 3000 },
                    { name: 'Mie', ventas: 2000 }, { name: 'Jue', ventas: 2780 },
                    { name: 'Vie', ventas: 1890 }, { name: 'Sab', ventas: 2390 },
                    { name: 'Dom', ventas: 3490 },
                ]);

                setFlavorData([
                    { name: 'Chocolate', value: 400 }, { name: 'Vainilla', value: 300 },
                    { name: 'Fresa', value: 300 }, { name: 'Moka', value: 200 },
                ]);

            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentBranch) {
            fetchDashboardData();
        }
    }, [currentBranch]);

    return (
        <div className="space-y-8 animate-fade-in-bento pb-24">
            {/* Global Quick Actions Palette */}
            <QuickActions />

            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-serif font-bold text-text-primary">
                    Hola, {user?.username?.split(' ')[0] || 'Usuario'} 👋
                </h1>
                <p className="text-text-secondary mt-1">
                    {isOwnerOrAdmin
                        ? `Panel de Control - ${currentBranch?.name || 'Sucursal Principal'}`
                        : '¡Que tengas un excelente turno!'}
                </p>
            </div>

            import Skeleton from '../components/ui/Skeleton';

            // ... (inside component)

            {loading ? (
                // Skeleton Loading State
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border h-32 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <Skeleton className="h-4 w-12 rounded-full" />
                            </div>
                            <div>
                                <Skeleton className="h-8 w-24 mb-2" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Role-Based Content Rendering */}
                    {isOwnerOrAdmin ? (
                        <OwnerWidgets
                            stats={stats}
                            salesData={salesData}
                            flavorData={flavorData}
                        />
                    ) : (
                        <EmployeeWidgets
                            orders={recentOrders}
                        />
                    )}

                    {/* Shared: Recent Activity Table */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h3 className="text-xl font-bold text-text-primary">
                                {isOwnerOrAdmin ? 'Pedidos Recientes' : 'Tus Pedidos'}
                            </h3>
                            <button className="text-sm font-medium text-brand-primary hover:text-brand-secondary">Ver todos</button>
                        </div>
                        <ActionableTable
                            data={recentOrders}
                            onEdit={(item) => console.log('Edit', item)}
                            onPrint={(item) => console.log('Print', item)}
                            onWhatsApp={handleWhatsApp}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
