import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, X, ChefHat } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const PinPadModal = ({ isOpen, onClose, onSuccess }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    const handleNumberClick = (num) => {
        if (pin.length < 4) {
            setPin(prev => prev + num);
            setError(false);
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setError(false);
    };

    const handleSubmit = () => {
        if (pin === '1234') { // Hardcoded correct PIN
            onSuccess();
            setPin('');
        } else {
            setError(true);
            setPin(''); // Clear on error or keep? Usually clear.
            setTimeout(() => setError(false), 1000);
        }
    };

    // Auto-submit on 4 digits? Optional. Let's stick to explicit or auto.
    // Let's do auto-submit for better UX
    if (pin.length === 4 && !error) {
        // use setTimeout to allow render of 4th digit
        setTimeout(() => {
            if (pin === '1234') {
                onSuccess();
                setPin('');
            } else {
                setError(true);
                setPin('');
            }
        }, 300);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-sm"
                    >
                        <GlassCard className={`p-6 border-2 ${error ? 'border-red-500 animate-shake' : 'border-slate-700'}`}>
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                    <ChefHat className="text-brand-primary" /> Acceso Cocina
                                </h2>
                                <button onClick={onClose} className="text-gray-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* PIN Display */}
                            <div className="flex justify-center gap-4 mb-8">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-4 h-4 rounded-full transition-all duration-200 ${i < pin.length
                                                ? (error ? 'bg-red-500' : 'bg-brand-primary scale-125')
                                                : 'bg-slate-700'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Keypad */}
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => handleNumberClick(num.toString())}
                                        className="h-16 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-2xl font-bold transition-colors active:scale-95 border border-slate-700"
                                    >
                                        {num}
                                    </button>
                                ))}
                                <div className="h-16"></div> {/* Spacer */}
                                <button
                                    onClick={() => handleNumberClick('0')}
                                    className="h-16 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-2xl font-bold transition-colors active:scale-95 border border-slate-700"
                                >
                                    0
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="h-16 rounded-xl bg-slate-800/50 hover:bg-red-900/30 text-red-400 flex items-center justify-center transition-colors active:scale-95 border border-slate-700"
                                >
                                    <Delete size={24} />
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PinPadModal;
