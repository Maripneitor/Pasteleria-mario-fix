import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Settings, BarChart2 } from 'lucide-react';
import GlassCard from '../../ui/GlassCard';
import StatsGrid from '../StatsGrid';
import SalesChart from '../SalesChart';
import FlavorChart from '../FlavorChart';
import { useNavigate } from 'react-router-dom';

const OwnerWidgets = ({ stats, salesData, flavorData }) => {
    const navigate = useNavigate();

    const ShortcutCard = ({ label, icon: Icon, onClick, color }) => (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex flex-col items-center justify-center p-4 bg-white dark:bg-surface-card rounded-xl border border-border dark:border-white/5 shadow-sm hover:shadow-md transition-all h-24 gap-2"
        >
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon size={20} />
            </div>
            <span className="text-xs font-semibold text-text-primary">{label}</span>
        </motion.button>
    );

    return (
        <div className="space-y-6">
            {/* Key Metrics - Bento Row 1 */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-text-primary mb-4 px-1">Resumen General</h2>
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
                <GlassCard className="lg:col-span-2 p-6 min-h-[400px]">
                    <h3 className="text-lg font-bold mb-4 text-text-primary">Tendencia de Ventas</h3>
                    <SalesChart data={salesData} />
                </GlassCard>
                <GlassCard className="lg:col-span-1 p-6 min-h-[400px]">
                    <h3 className="text-lg font-bold mb-4 text-text-primary">Top Sabores</h3>
                    <FlavorChart data={flavorData} />
                </GlassCard>
            </div>
        </div>
    );
};

export default OwnerWidgets;
