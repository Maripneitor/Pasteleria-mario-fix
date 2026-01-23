import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, ArrowRight } from 'lucide-react';

const ProductionCard = ({ folio, accentColor, onNextStep }) => {
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const isToday = folio.deliveryDate === today;

    // Determine target next status for button label/logic if needed,
    // though the handler passed from parent likely knows the sequence.

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className={`
                relative bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border 
                ${isToday
                    ? 'border-bakery-primary ring-2 ring-bakery-primary/30 shadow-[0_0_15px_rgba(227,28,121,0.3)]'
                    : 'border-gray-200 dark:border-slate-700'}
                transition-all duration-300
            `}
        >
            {/* Header: Folio & Date */}
            <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-xs font-bold text-gray-400">#{folio.folioNumber}</span>
                <div className={`flex items-center gap-1 text-xs font-bold ${isToday ? 'text-bakery-primary animate-pulse' : 'text-gray-500'}`}>
                    <Clock size={12} />
                    {isToday ? 'ENTREGA HOY' : folio.deliveryDate}
                </div>
            </div>

            {/* Client */}
            <h4 className="font-bold text-gray-800 dark:text-white mb-1 truncate flex items-center gap-1">
                <User size={14} className="text-gray-400" />
                {folio.clientName}
            </h4>

            {/* Critical Production Info */}
            <div className="bg-bakery-50 dark:bg-slate-700/50 rounded-lg p-2 mb-3 text-sm">
                <div className="flex justify-between mb-1">
                    <span className="text-gray-500 text-xs">Sabor:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {Array.isArray(folio.cakeFlavor) ? folio.cakeFlavor.join(', ') : folio.cakeFlavor}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 text-xs">Relleno:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[120px]">
                        {/* Handle filling if it's object or string */}
                        {typeof folio.filling === 'string' && folio.filling.startsWith('[')
                            ? JSON.parse(folio.filling).map(f => f.name).join(', ')
                            : folio.filling}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onNextStep && onNextStep(folio);
                }}
                className={`
                    w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2
                    transition-colors duration-200
                    ${isToday
                        ? 'bg-bakery-primary text-white hover:bg-bakery-accent shadow-lg shadow-bakery-primary/30'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'}
                `}
            >
                Siguiente Etapa <ArrowRight size={12} />
            </button>
        </motion.div>
    );
};

export default ProductionCard;
