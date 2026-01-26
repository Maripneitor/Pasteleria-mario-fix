import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductionCard from './kanban/ProductionCard';

const KanbanColumn = ({ status, title, folios = [], color, onDrop, onNextStatus }) => {
    const safeFolios = Array.isArray(folios) ? folios : [];
    const filteredFolios = safeFolios.filter(f => f.status === status);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const folioId = e.dataTransfer.getData("folioId");
        if (folioId) {
            onDrop(folioId, status);
        }
    };

    return (
        <div
            className="flex flex-col h-full min-w-[300px] w-80 bg-gray-100 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden flex-shrink-0 shadow-inner"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Header */}
            <div className={`p-4 border-b border-gray-200 dark:border-slate-700 ${color.replace('bg-', 'bg-')} bg-opacity-10 dark:bg-opacity-20 backdrop-blur-md`}>
                <div className="flex justify-between items-center">
                    <h3 className={`font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wide`}>
                        <div className={`w-3 h-3 rounded-full ${color.replace('bg-', 'bg-').replace('bg-opacity-10', '')} shadow-sm`}></div>
                        {title}
                    </h3>
                    <span className="bg-white dark:bg-slate-700 px-2.5 py-0.5 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm">
                        {filteredFolios.length}
                    </span>
                </div>
            </div>

            {/* Cards Scroll Area */}
            <div className="flex-1 p-3 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-3 bg-gray-50/50 dark:bg-slate-900/50">
                <AnimatePresence mode="popLayout">
                    {filteredFolios.map((folio) => (
                        <motion.div
                            key={folio.id || folio._id || folio.folioNumber}
                            layout
                            layoutId={folio.id || folio._id || folio.folioNumber}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            onDragStart={(e) => {
                                e.dataTransfer.setData("folioId", folio.id || folio._id || folio.folioNumber);
                            }}
                            draggable
                            whileDrag={{ scale: 1.05, rotate: 2, cursor: "grabbing" }}
                            className="cursor-move touch-none"
                        >
                            <ProductionCard
                                folio={folio}
                                accentColor={color.replace('bg-opacity-10', '')}
                                onNextStep={onNextStatus}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredFolios.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-gray-400 text-sm italic">
                        Sin pedidos
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(KanbanColumn);
