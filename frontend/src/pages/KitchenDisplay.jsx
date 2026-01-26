import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KitchenOrderCard from '../components/kitchen/KitchenOrderCard';
import { Bell, Maximize2 } from 'lucide-react';
import { useOrderSync } from '../context/OrderSyncContext';

const KitchenDisplay = () => {
    const { orders, updateOrderStatus } = useOrderSync();
    // Filter out delivered items, keep pending/in-production/decorated
    const activeOrders = orders.filter(o => o.status !== 'Entregado');

    const handleSwipeLeft = (id) => {
        // Swipe Left = Terminado / Decorado (Next Step)
        updateOrderStatus(id, 'Decorado');
        // Or if we want to remove it from screen:
        // updateOrderStatus(id, 'Entregado'); 
    };

    const handleSwipeRight = (id) => {
        // Swipe Right = En Producción
        updateOrderStatus(id, 'En Producción');
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 overflow-hidden relative selection:bg-none">
            {/* Minimal Header */}
            <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex items-center gap-3">
                    <Bell className="text-yellow-500 animate-bounce" />
                    <h1 className="text-2xl font-black uppercase tracking-widest text-slate-400">
                        Cocina <span className="text-white">La Fiesta</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-white bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
                        {activeOrders.length}
                    </span>
                    <button onClick={toggleFullScreen} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <Maximize2 size={24} />
                    </button>
                </div>
            </div>

            {/* Grid of Active Orders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2 pb-20 overflow-y-auto h-[calc(100vh-100px)]">
                <AnimatePresence>
                    {activeOrders.map(order => (
                        <motion.div
                            key={order.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0, x: -100 }}
                            layout
                        >
                            <KitchenOrderCard
                                order={order}
                                onSwipeLeft={() => handleSwipeLeft(order.id)}
                                onSwipeRight={() => handleSwipeRight(order.id)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Overlay hint for new users */}
            <div className="fixed bottom-0 left-0 right-0 p-2 text-center text-xs text-slate-600 pointer-events-none">
                KDS v1.0 • Desliza las tarjetas para procesar
            </div>
        </div>
    );
};

export default KitchenDisplay;
