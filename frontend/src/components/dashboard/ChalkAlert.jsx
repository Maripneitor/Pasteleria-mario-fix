import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const ChalkAlert = ({ type = 'warning', message }) => {
    const isCritical = type === 'critical';

    // Neon styles for rustic dark mode
    const borderColor = isCritical ? 'border-red-500' : 'border-yellow-400';
    const textColor = isCritical ? 'text-red-400' : 'text-yellow-300';
    const shadowClass = isCritical ? 'shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'shadow-[0_0_10px_rgba(250,204,21,0.5)]';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`
                bg-[#1A1A1A] border-l-4 ${borderColor} ${shadowClass}
                p-4 rounded-r-lg mb-3 flex items-center gap-3 font-sketch relative overflow-hidden
            `}
        >
            <AlertTriangle className={textColor} size={24} strokeWidth={2.5} />
            <div>
                <h4 className={`font-bold text-lg uppercase tracking-widest ${textColor} opacity-90`}>
                    {isCritical ? 'Alerta Stock' : 'Precaución'}
                </h4>
                <p className="text-gray-300 font-sans text-sm">{message}</p>
            </div>

            {/* Noise texture overlay for chalkboard feel */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
        </motion.div>
    );
};

export default ChalkAlert;
