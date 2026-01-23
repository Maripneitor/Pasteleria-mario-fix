import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import SignaturePad from './delivery/SignaturePad';

const SignaturePadModal = ({ isOpen, onClose, onSave, isSaving }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-serif font-bold text-gray-800 dark:text-white text-lg">Firmar Entrega</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-500 text-sm mb-4">
                        Por favor, solicite al cliente su firma para confirmar la recepción del pedido en buen estado.
                    </p>

                    {isSaving ? (
                        <div className="h-48 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
                            <Loader2 size={32} className="animate-spin text-bakery-primary mb-2" />
                            <span className="text-gray-500 font-medium">Guardando firma...</span>
                        </div>
                    ) : (
                        <SignaturePad
                            onSave={onSave}
                            onCancel={onClose}
                        />
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default SignaturePadModal;
