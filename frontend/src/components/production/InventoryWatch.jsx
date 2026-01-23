import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Package } from 'lucide-react';
import { RECIPES, INVENTORY_BASELINE } from '../../utils/recipes';

const InventoryWatch = ({ activeFolios }) => {
    // Calculate total needs based on active folios ("Pendiente" and "En Producción")
    const inventoryNeeds = useMemo(() => {
        const needs = {};

        activeFolios.forEach(folio => {
            // Only count folios that haven't been completed
            if (folio.status === 'Entregado' || folio.status === 'Listo para Entrega') return;

            // Determine flavor
            let flavor = folio.cakeFlavor;
            if (Array.isArray(flavor)) flavor = flavor[0]; // Simplification
            if (typeof flavor !== 'string') flavor = 'Chocolate'; // Fallback

            // Basic fuzzy match for recipe key
            const recipeKey = Object.keys(RECIPES).find(k => flavor && flavor.includes(k)) || 'Chocolate';
            const recipe = RECIPES[recipeKey];

            if (recipe) {
                const persons = parseInt(folio.persons) || 10;
                // Calculate consumption for this order
                Object.entries(recipe).forEach(([ingredient, perPersonAmount]) => {
                    needs[ingredient] = (needs[ingredient] || 0) + (perPersonAmount * persons);
                });
            }
        });
        return needs;
    }, [activeFolios]);

    // Comparison Logic
    const inventoryStatus = INVENTORY_BASELINE.map(item => {
        const required = inventoryNeeds[item.name] || 0;
        const remaining = item.stock - required;
        const status = remaining < item.minLevel ? 'critical' : remaining < (item.minLevel * 1.5) ? 'low' : 'ok';
        const percentUsed = (required / item.stock) * 100;

        return { ...item, required, remaining, status, percentUsed };
    });

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-slate-800 mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Package size={16} /> Proyección de Materia Prima
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {inventoryStatus.map(item => (
                    <div key={item.id} className="relative">
                        <div className="flex justify-between items-end mb-1">
                            <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{item.name}</span>
                            <span className={`text-xs font-bold ${item.status === 'critical' ? 'text-red-500' : 'text-gray-400'}`}>
                                {item.remaining.toFixed(1)} {item.unit}
                            </span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            {/* Usage Bar */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(item.percentUsed, 100)}%` }}
                                className={`h-full rounded-full ${item.status === 'critical' ? 'bg-red-500' :
                                        item.status === 'low' ? 'bg-amber-400' : 'bg-green-400'
                                    }`}
                            />
                        </div>

                        {/* Critical Alert */}
                        {item.status === 'critical' && (
                            <div className="absolute -top-1 -right-1">
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            </div>
                        )}

                        {item.required > 0 && (
                            <p className="text-[10px] text-gray-400 mt-1">
                                Se requieren {item.required.toFixed(1)} {item.unit}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventoryWatch;
