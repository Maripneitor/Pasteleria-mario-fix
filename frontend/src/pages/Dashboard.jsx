import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockOrders } from '../utils/constants'; // Backup mock data
import { calculateKPIData } from '../utils/analyticsHelpers';
import dashboardService from '../services/dashboard.service';

// New Components
import QuickActions from '../components/dashboard/QuickActions';
import OwnerWidgets from '../components/dashboard/widgets/OwnerWidgets';
import EmployeeWidgets from '../components/dashboard/widgets/EmployeeWidgets';
import ActionableTable from '../components/dashboard/ActionableTable';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/EmptyState';

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

                // Fetch Owner Metrics (which includes similar data to what we need)
                // Note: The UI expects specific stats structure. Ideally backend returns this.
                // For now, we'll try to get data from service, or fall back to local calculation if service returns something else.

                let dashboardData = null;
                if (isOwnerOrAdmin) {
                    dashboardData = await dashboardService.getOwnerMetrics();
                } else {
                    dashboardData = await dashboardService.getDeveloperMetrics(); // Or employee endpoint
                }

                // If service returns meaningful data, map it.
                // Currently mock fixtures return: { totalSales, orderCount, pendingBalance, topProducts, recentOrders }

                if (dashboardData) {
                    // Map service data to stats state if structure matches
                    // ... logic to update stats ...
                    // For safety during migration, we will use the service call to ensure connectivity/fallback, 
                    // but might rely on the existing calculateKPIData logic if dashboardData doesn't match perfectly yet.

                    // Let's assume dashboardData has what we need or we use the mockOrders as backup for calculation
                    // Actually, let's keep the existing UI logic safe:
                }

                // Using Mock/Simulation logic to ensure UI renders nicely during Refactor
                // await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay -> Service handles delay if mock

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

                // Simulate empty flavor data for testing if needed, or keeping it populated
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
            <PageHeader
                title={`Hola, ${user?.username?.split(' ')[0] || 'Usuario'} 👋`}
                subtitle={isOwnerOrAdmin
                    ? `Panel de Control - ${currentBranch?.name || 'Sucursal Principal'}`
                    : '¡Que tengas un excelente turno!'}
            />

            {loading ? (
                // Skeleton Loading State
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="p-6 h-32 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <Skeleton className="h-4 w-12 rounded-full" />
                            </div>
                            <div>
                                <Skeleton className="h-8 w-24 mb-2" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </Card>
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
                            <h3 className="text-xl font-bold text-text-primary font-serif tracking-tight">
                                {isOwnerOrAdmin ? 'Pedidos Recientes' : 'Tus Pedidos'}
                            </h3>
                            <button className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors">Ver todos</button>
                        </div>

                        {recentOrders.length > 0 ? (
                            <ActionableTable
                                data={recentOrders}
                                onEdit={(item) => console.log('Edit', item)}
                                onPrint={(item) => console.log('Print', item)}
                                onWhatsApp={handleWhatsApp}
                            />
                        ) : (
                            <Card className="py-12 flex justify-center">
                                <EmptyState
                                    message="No hay pedidos recientes"
                                    subMessage="Los nuevos pedidos aparecerán aquí"
                                />
                            </Card>
                        )}

                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
