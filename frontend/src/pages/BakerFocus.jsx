import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastSystem';
import folioService from '../services/folioService';
import { sanitizeFolioList } from '../utils/folioSanitizer';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, ChevronRight, Play, Check } from 'lucide-react';

const BakerFocus = () => {
    const [orders, setOrders] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const socket = useSocket();
    const { showSuccess } = useToast();

    useEffect(() => {
        fetchProductionOrders();
    }, []);

    useEffect(() => {
        if (!socket) return;
        const handleUpdate = () => fetchProductionOrders();
        socket.on('folio:updated', handleUpdate);
        socket.on('folio:created', handleUpdate);
        return () => {
            socket.off('folio:updated', handleUpdate);
            socket.off('folio:created', handleUpdate);
        };
    }, [socket]);

    const fetchProductionOrders = async () => {
        try {
            const response = await folioService.getAllFolios({ status: 'En Producción' });
            const data = Array.isArray(response) ? response : (response?.data || []);
            setOrders(sanitizeFolioList(data));
        } catch (err) {
            console.error("Error fetching focus orders", err);
        }
    };

    const handleComplete = async (folioId) => {
        try {
            await folioService.updateFolioStatus(folioId, { status: 'Listo para Entrega' });
            showSuccess(`Pedido #${folioId} marcado como LISTO.`);
            fetchProductionOrders();
            setActiveOrder(null);
        } catch (err) {
            console.error("Error updating order", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
            <header className="mb-8 flex justify-between items-center">
                <h1 className="text-4xl font-black text-yellow-500 tracking-tight">MODO REPOSTERO</h1>
                <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                    <span className="text-gray-400 text-sm uppercase font-bold tracking-wider">Pendientes:</span>
                    <span className="text-2xl font-bold ml-2 text-white">{orders.length}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[80vh]">
                {/* Order List */}
                <div className="lg:col-span-1 bg-slate-800 rounded-3xl p-4 overflow-y-auto border border-slate-700">
                    <h2 className="text-xl font-bold mb-4 text-gray-400 px-2">En Cola</h2>
                    <div className="space-y-4">
                        {orders.map(order => (
                            <motion.div
                                key={order.id}
                                layoutId={order.id}
                                onClick={() => setActiveOrder(order)}
                                className={`p-6 rounded-2xl cursor-pointer transition-all border-2 ${activeOrder?.id === order.id ? 'bg-indigo-600 border-indigo-400 shadow-2xl scale-105' : 'bg-slate-700 border-transparent hover:bg-slate-600'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-2xl font-bold">#{order.folioNumber}</span>
                                    <span className="text-sm bg-black/20 px-2 py-1 rounded">{order.deliveryTime}</span>
                                </div>
                                <p className="text-lg font-medium opacity-90">{order.cakeFlavor} / {order.filling}</p>
                            </motion.div>
                        ))}
                        {orders.length === 0 && <p className="text-gray-500 text-center py-10">No hay pedidos en producción.</p>}
                    </div>
                </div>

                {/* Active Order View */}
                <div className="lg:col-span-2 bg-slate-800 rounded-3xl p-8 border border-slate-700 relative overflow-hidden flex flex-col justify-center items-center text-center">
                    {activeOrder ? (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeOrder.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full max-w-2xl"
                            >
                                <div className="mb-6">
                                    <span className="text-indigo-400 font-bold tracking-widest uppercase mb-2 block">Preparando Ahora</span>
                                    <h2 className="text-6xl font-black mb-2">#{activeOrder.folioNumber}</h2>
                                    <p className="text-2xl text-gray-300">{activeOrder.clientName}</p>
                                </div>

                                <div className="bg-slate-700/50 p-8 rounded-3xl mb-8 border border-slate-600">
                                    <div className="grid grid-cols-2 gap-8 text-left">
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase font-bold">Sabor</p>
                                            <p className="text-3xl font-bold text-white">{activeOrder.cakeFlavor}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase font-bold">Relleno</p>
                                            <p className="text-3xl font-bold text-white">{activeOrder.filling}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase font-bold">Tamaño</p>
                                            <p className="text-xl font-bold text-white">{activeOrder.persons} Personas</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase font-bold">Decoración</p>
                                            <p className="text-xl font-bold text-white">{activeOrder.designDescription || 'Estándar'}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleComplete(activeOrder.id)}
                                    className="w-full bg-green-500 hover:bg-green-400 text-black font-black text-2xl py-6 rounded-2xl shadow-lg hover:shadow-green-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-4"
                                >
                                    <CheckCircle size={32} />
                                    MARCAR COMO LISTO
                                </button>
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <div className="text-gray-600">
                            <Clock size={64} className="mx-auto mb-4 opacity-20" />
                            <p className="text-2xl font-bold">Selecciona un pedido para comenzar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BakerFocus;
