import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({
    message = "No hay pedidos en la bandeja por ahora.",
    subMessage = "¡Es un buen momento para crear algo delicioso!",
    action
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {/* Rustic Illustration Placeholder (SVG or simple CSS shapes) */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8 relative"
            >
                <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto opacity-50">
                    {/* Simple Bakery Icon via SVG/Paths could go here, keeping it abstract for now */}
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-amber-800/40">
                        <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                        <line x1="6" y1="17" x2="18" y2="17" />
                    </svg>
                </div>
            </motion.div>

            <h3 className="text-xl font-bold text-gray-800 mb-2 font-serif">Bandeja Vacía</h3>
            <p className="text-gray-500 max-w-sm mb-8">
                {message}
                <br />
                <span className="text-sm mt-1 block opacity-75">{subMessage}</span>
            </p>

            {action && (
                <div>
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
