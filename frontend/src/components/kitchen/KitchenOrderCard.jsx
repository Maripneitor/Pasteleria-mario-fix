import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Clock, CheckCircle, AlertTriangle, ChefHat } from 'lucide-react';

const KitchenOrderCard = ({ order, onSwipeLeft, onSwipeRight }) => {
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
    const background = useTransform(
        x,
        [-200, 0, 200],
        ['rgba(16, 185, 129, 0.2)', 'rgba(30, 41, 59, 1)', 'rgba(59, 130, 246, 0.2)']
    );

    // Urgency Logic
    const getUrgencyStyles = () => {
        // Mock comparison dates
        // In real app: const diff = new Date(order.deliveryDate) - new Date();
        // Here using `order.urgency` mock prop
        switch (order.urgency) {
            case 'critical': return 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse-border';
            case 'high': return 'border-amber-500 shadow-none';
            default: return 'border-green-500 shadow-none';
        }
    };

    const handleDragEnd = (_, info) => {
        if (info.offset.x < -100) {
            onSwipeLeft(order.id); // Complete
        } else if (info.offset.x > 100) {
            onSwipeRight(order.id); // In Progress
        }
    };

    return (
        <motion.div
            style={{ x, opacity, background }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className={`relative w-full h-64 rounded-3xl border-l-[12px] ${getUrgencyStyles()} bg-slate-800 p-6 flex flex-col justify-between overflow-hidden touch-none select-none my-4`}
        >
            {/* Background Hints */}
            <div className="absolute inset-y-0 left-4 flex items-center justify-start pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <ChefHat size={48} className="text-blue-500/50" />
            </div>
            <div className="absolute inset-y-0 right-4 flex items-center justify-end pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <CheckCircle size={48} className="text-green-500/50" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-4xl font-black text-white">#{order.folioNumber}</span>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={20} />
                        <span className="text-xl font-bold">{order.deliveryTime}</span>
                    </div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-1 leading-tight line-clamp-2">
                    {order.cakeFlavor}
                </h3>
                <p className="text-xl text-gray-400 mb-4 line-clamp-1">
                    {order.decoration || 'Decoración estándar'}
                </p>

                {order.notes && (
                    <div className="bg-slate-700/50 p-2 rounded-lg border border-slate-600">
                        <p className="text-yellow-400 text-sm font-medium flex items-center gap-2">
                            <AlertTriangle size={14} /> Note: {order.notes}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer / Instructions */}
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500 mt-4">
                <span>Desliza → Cocinando</span>
                <span>← Terminado</span>
            </div>
        </motion.div>
    );
};

export default KitchenOrderCard;
