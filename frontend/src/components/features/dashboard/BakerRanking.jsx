import React from 'react';
import { motion } from 'framer-motion';

const BakerRanking = ({ bakers }) => {
    const sortedBakers = [...(bakers || [])].sort((a, b) => b.folios - a.folios);
    const top3 = sortedBakers.slice(0, 3);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Pastelero del Mes</h3>

            {top3.length === 0 ? (
                <div className="text-center text-gray-400 py-10">No hay datos suficientes.</div>
            ) : (
                <div className="space-y-4">
                    {/* Winner Highlight */}
                    {top3[0] && (
                        <div className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                            <div className="text-2xl">👑</div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">{top3[0].name}</p>
                                <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">{top3[0].folios} Folios • {top3[0].perfectRate}% Calidad</p>
                            </div>
                        </div>
                    )}

                    {/* Standard List */}
                    <div className="space-y-2">
                        {sortedBakers.slice(1).map((baker, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-400 w-4">{idx + 2}.</span>
                                    <span className="text-gray-700 dark:text-gray-200">{baker.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{baker.folios} pedidos</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BakerRanking;
