import React from 'react';
import { Package, AlertTriangle, RefreshCw } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';

const Inventory = () => {
    const { data: inventory, isLoading, isError } = useInventory();

    if (isLoading) return <div className="p-10 text-center">Cargando inventario...</div>;
    if (isError) return <div className="p-10 text-center text-red-500">Error al sincronizar inventario.</div>;

    return (
        <div className="p-6 bg-bakery-cream min-h-screen">
            <h1 className="text-3xl font-serif font-bold text-bakery-text mb-8 flex items-center gap-3">
                <Package className="text-bakery-accent" />
                Inventario de Materia Prima
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventory.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-white hover:border-gray-200 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                                <p className="text-sm text-gray-500">Min: {item.minLevel} {item.unit}</p>
                            </div>
                            {item.status === 'low' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold flex gap-1"><AlertTriangle size={14} /> Bajo</span>}
                            {item.status === 'critical' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex gap-1"><AlertTriangle size={14} /> Crítico</span>}
                            {item.status === 'ok' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">OK</span>}
                        </div>

                        {/* Stock Display */}
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <span className="text-3xl font-bold text-gray-800">{item.availableStock.toFixed(1)}</span>
                                <span className="text-gray-500 font-medium ml-1">{item.unit}</span>
                                <span className="text-xs text-gray-400 block">Disponible</span>
                            </div>
                            {/* Projected Usage Overlay */}
                            {item.projectedUsage > 0 && (
                                <div className="text-right">
                                    <span className="text-lg font-bold text-orange-500">-{item.projectedUsage.toFixed(2)}</span>
                                    <span className="text-xs text-orange-400 block">En Uso</span>
                                </div>
                            )}
                        </div>

                        {/* Visual Bar */}
                        <div className="w-full bg-gray-100 rounded-full h-2 relative overflow-hidden">
                            {/* Base usage bar */}
                            <div
                                className={`h-full rounded-full absolute left-0 top-0 transition-all duration-500 ${item.status === 'ok' ? 'bg-green-500' : item.status === 'low' ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(100, (item.availableStock / (item.minLevel * 2)) * 100)}%`, zIndex: 10 }}
                            ></div>

                            {/* Usage indicator (ghost bar) */}
                            <div
                                className="h-full rounded-full absolute left-0 top-0 bg-red-200"
                                style={{ width: `${Math.min(100, (item.stock / (item.minLevel * 2)) * 100)}%`, zIndex: 0 }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-center text-gray-400 mt-10 text-sm flex items-center justify-center gap-2">
                <RefreshCw size={14} /> Sincronización en tiempo real activa
            </p>
        </div>
    );
};

export default Inventory;
