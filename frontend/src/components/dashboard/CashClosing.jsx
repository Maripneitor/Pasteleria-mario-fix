import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const CashClosing = () => {
    const { auth } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchData();
    }, [date]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/folios/cash-close?date=${date}`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });
            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            console.error("Error fetching cash close:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !data) return <div className="text-center p-4">Cargando pizarra...</div>;

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-xl font-handwritten relative overflow-hidden border-8 border-wood transform rotate-1 transition-transform hover:rotate-0 duration-300">
            {/* Chalkdust effect */}
            <div className="absolute inset-0 bg-chalk-pattern opacity-10 pointer-events-none"></div>

            <div className="relative z-10 text-white">
                <div className="flex justify-between items-center mb-6 border-b-2 border-white/20 pb-2 border-dashed">
                    <h2 className="text-3xl font-bold tracking-wider">Cierre de Caja</h2>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-transparent border border-white/30 rounded px-2 py-1 text-sm focus:outline-none focus:border-white/60"
                    />
                </div>

                <div className="grid grid-cols-2 gap-8 text-center">
                    <div className="space-y-1">
                        <p className="text-sm opacity-70 uppercase tracking-widest">Ventas Totales</p>
                        <p className="text-4xl font-bold text-green-300 transform -rotate-2">${data?.totalSales || '0.00'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm opacity-70 uppercase tracking-widest">Anticipos</p>
                        <p className="text-4xl font-bold text-blue-300 transform rotate-1">${data?.totalAdvances || '0.00'}</p>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-white/20 border-dashed flex justify-between items-end">
                    <div className="text-left">
                        <p className="text-xs opacity-50">Pedidos del día</p>
                        <p className="text-xl">{data?.orderCount} folios</p>
                    </div>

                    <button
                        onClick={() => {
                            const summary = `*Cierre de Caja - ${date}* %0A` +
                                `💰 Ventas Totales: $${data?.totalSales} %0A` +
                                `💳 Anticipos: $${data?.totalAdvances} %0A` +
                                `📉 Pendiente: $${data?.pendingBalance} %0A` +
                                `📦 Pedidos: ${data?.orderCount}`;
                            const phone = data?.ownerPhone || '';
                            const url = `https://wa.me/${phone}?text=${summary}`;
                            window.open(url, '_blank');
                        }}
                        className="mb-2 bg-green-600 hover:bg-green-500 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
                        title="Enviar resumen al Dueño"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>
                    </button>

                    <div className="text-right">
                        <p className="text-sm opacity-70 uppercase tracking-widest">Saldo Pendiente</p>
                        <p className="text-2xl font-bold text-red-300">${data?.pendingBalance || '0.00'}</p>
                    </div>
                </div>
            </div>

            {/* Decorations */}
            <div className="absolute top-2 right-2 opacity-20 text-xs">Pastelería La Fiesta</div>
        </div>
    );
};

export default CashClosing;
