import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ErrorState = ({
    title = "Algo salió mal",
    message = "No pudimos cargar la información. Por favor revisa tu conexión.",
    onRetry,
    retryLabel = "Intentar de nuevo"
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50/50 rounded-xl border border-red-100">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4"
            >
                <AlertCircle size={32} />
            </motion.div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-sm mb-6 text-sm">{message}</p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-white hover:bg-gray-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                    <RefreshCw size={16} />
                    {retryLabel}
                </button>
            )}
        </div>
    );
};

export default ErrorState;
