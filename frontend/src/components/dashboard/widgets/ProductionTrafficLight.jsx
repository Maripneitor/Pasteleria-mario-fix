import React from 'react';
import GlassCard from '../../ui/GlassCard';
import { AlertTriangle, Clock, Calendar } from 'lucide-react';

const ProductionTrafficLight = ({ orders }) => {
    // Mock Logic for demonstration
    // In a real app, compare order.deliveryDate with actual today

    // Simulating counts
    const urgentCount = 2; // Hardcoded or filtered by 'High Priority'
    const todayCount = 5;
    const tomorrowCount = 8;

    return (
        <div className="grid grid-cols-3 gap-4 h-full">
            {/* Urgent - Red */}
            <GlassCard className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2 animate-pulse">
                    <AlertTriangle size={24} />
                </div>
                <span className="text-3xl font-bold text-red-700 dark:text-red-400">{urgentCount}</span>
                <span className="text-xs font-medium text-red-600/80 uppercase tracking-wide">Urgentes</span>
            </GlassCard>

            {/* Today - Yellow */}
            <GlassCard className="flex flex-col items-center justify-center p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                    <Clock size={24} />
                </div>
                <span className="text-3xl font-bold text-amber-700 dark:text-amber-400">{todayCount}</span>
                <span className="text-xs font-medium text-amber-600/80 uppercase tracking-wide">Para Hoy</span>
            </GlassCard>

            {/* Tomorrow - Green/Blue */}
            <GlassCard className="flex flex-col items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/50">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                    <Calendar size={24} />
                </div>
                <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{tomorrowCount}</span>
                <span className="text-xs font-medium text-emerald-600/80 uppercase tracking-wide">Mañana</span>
            </GlassCard>
        </div>
    );
};

export default ProductionTrafficLight;
