import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CashCloseTicket = ({ isOpen, onClose }) => {
    const { token } = useAuth();
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchSummary();
        }
    }, [isOpen]);

    const fetchSummary = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/daily-summary`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSummary(response.data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar el cierre de caja.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleShareWhatsapp = () => {
        if (!summary) return;

        const date = summary.date;
        const msg = `
*🧾 CIERRE DE CAJA - ${date}*

*Total Ventas:* $${summary.totalSales.toFixed(2)}
*Total Anticipos:* $${summary.totalAdvances.toFixed(2)}
*Saldo Pendiente:* $${summary.pendingBalance.toFixed(2)}
-------------------------
*💰 INGRESO REAL (Anticipos):* $${summary.realIncome.toFixed(2)}

_Pastelería Mario - Sistema_
`.trim();

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm"
                    >
                        {/* Ticket Style Container */}
                        <div className="bg-[#f4e4bc] p-6 rounded-sm shadow-2xl transform rotate-1 border-t-8 border-bakery-chocolate relative">
                            {/* Perforated edge effect */}
                            <div className="absolute -bottom-2 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iOCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')] bg-repeat-x"></div>

                            <button onClick={onClose} className="absolute top-2 right-2 p-1 text-bakery-chocolate hover:bg-black/5 rounded-full">
                                <X size={20} />
                            </button>

                            <div className="text-center mb-6">
                                <h2 className="font-serif font-bold text-2xl text-bakery-chocolate">Cierre de Caja</h2>
                                <p className="text-sm font-mono text-gray-600 uppercase tracking-widest">{summary?.date || 'Cargando...'}</p>
                                <div className="w-full border-b-2 border-dashed border-gray-400 my-4"></div>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-8 text-gray-500 animate-pulse">Imprimiendo datos...</div>
                            ) : error ? (
                                <div className="text-center text-red-500 py-4">{error}</div>
                            ) : summary ? (
                                <div className="space-y-3 font-mono text-gray-800 text-sm">
                                    <div className="flex justify-between">
                                        <span>Total Ventas:</span>
                                        <span className="font-bold">${summary.totalSales.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Anticipos:</span>
                                        <span className="font-bold">${summary.totalAdvances.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-red-600">
                                        <span>Saldo Pendiente:</span>
                                        <span>${summary.pendingBalance.toFixed(2)}</span>
                                    </div>

                                    <div className="w-full border-b-2 border-dashed border-gray-400 my-4"></div>

                                    <div className="flex justify-between text-lg font-bold text-bakery-chocolate">
                                        <span>INGRESO REAL:</span>
                                        <span>${summary.realIncome.toFixed(2)}</span>
                                    </div>
                                </div>
                            ) : null}

                            <div className="mt-8">
                                <button
                                    onClick={handleShareWhatsapp}
                                    disabled={!summary}
                                    className="w-full py-3 bg-[#25D366] hover:bg-[#1dbf57] text-white font-bold rounded-lg shadow flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                                >
                                    <Send size={18} />
                                    Enviar a Dueño
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CashCloseTicket;
