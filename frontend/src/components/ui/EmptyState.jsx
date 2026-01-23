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
                <div className="w-32 h-32 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-6xl">🍰</span>
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
