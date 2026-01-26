import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Settings, BarChart2 } from 'lucide-react';
import { Card } from '../../ui/Card';
import StatsGrid from '../StatsGrid';
import SalesChart from '../SalesChart';
import FlavorChart from '../FlavorChart';
import EmptyState from '../../EmptyState';
import { useNavigate } from 'react-router-dom';

const OwnerWidgets = ({ stats, salesData, flavorData }) => {
    const navigate = useNavigate();

    const ShortcutCard = ({ label, icon: Icon, onClick, color }) => (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="w-full text-left"
        >
            <Card className="flex flex-col items-center justify-center p-4 h-24 gap-2 hover:shadow-md transition-all cursor-pointer bg-surface-card hover:bg-surface-card/80 border-border">
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon size={20} />
                </div>
                <span className="text-xs font-semibold text-text-primary">{label}</span>
            </Card>
        </motion.button>
    );

    return (
        <div className="space-y-6">
            {/* Key Metrics - Bento Row 1 */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-text-primary mb-4 px-1 font-serif tracking-tight">Resumen General</h2>
                <StatsGrid stats={stats} />
            </div>

            {/* Management Shortcuts - Bento Row 2 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <ShortcutCard
                    label="Usuarios"
                    icon={Users}
                    color="bg-purple-100 text-purple-600 dark:bg-purple-900/30"
                    onClick={() => navigate('/admin/users')}
                />
                <ShortcutCard
                    label="Reportes"
                    icon={FileText}
                    color="bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                    onClick={() => navigate('/estadisticas')}
                />
                <ShortcutCard
                    label="Finanzas"
                    icon={BarChart2}
                    color="bg-green-100 text-green-600 dark:bg-green-900/30"
                    onClick={() => navigate('/dashboard')}
                />
                <ShortcutCard
                    label="Configuración"
                    icon={Settings}
                    color="bg-gray-100 text-gray-600 dark:bg-gray-800"
                    onClick={() => navigate('/configuracion')}
                />
            </div>

            {/* Charts - Bento Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card glass className="lg:col-span-2 p-6 min-h-[400px]">
                    <h3 className="text-lg font-bold mb-4 text-text-primary font-serif">Tendencia de Ventas</h3>
                    {salesData && salesData.length > 0 ? (
                        <SalesChart data={salesData} />
                    ) : (
                        <div className="h-[300px] flex items-center justify-center">
                            <EmptyState message="No hay datos de ventas disponibles" subMessage="Intenta seleccionar otro rango de fechas" />
                        </div>
                    )}
                </Card>
                <Card glass className="lg:col-span-1 p-6 min-h-[400px]">
                    <h3 className="text-lg font-bold mb-4 text-text-primary font-serif">Top Sabores</h3>
                    {flavorData && flavorData.length > 0 ? (
                        <FlavorChart data={flavorData} />
                    ) : (
                        <div className="h-[300px] flex items-center justify-center">
                            <EmptyState message="Sin datos de sabores" subMessage="Realiza ventas para ver estadísticas" />
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default OwnerWidgets;
