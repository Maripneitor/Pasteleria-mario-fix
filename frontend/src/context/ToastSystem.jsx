import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Zap, MessageCircle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const showSuccess = (msg) => addToast('success', msg);
    const showError = (msg) => addToast('error', msg);
    const showAiActive = (msg) => addToast('ai', msg);
    const showWhatsapp = (msg) => addToast('whatsapp', msg);

    return (
        <ToastContext.Provider value={{ showSuccess, showError, showAiActive, showWhatsapp }}>
            {children}
            <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} type={toast.type} message={toast.message} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ type, message }) => {
    const variants = {
        initial: { opacity: 0, y: -20, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    const config = {
        success: {
            icon: <CheckCircle className="text-green-500" />,
            bg: 'bg-white',
            border: 'border-green-100',
            animation: { rotate: [0, 10, -10, 0] } // Subtle wiggle? Or just normal check
        },
        error: {
            icon: <XCircle className="text-red-500" />,
            bg: 'bg-red-50',
            border: 'border-red-100',
            animation: { x: [0, -5, 5, -5, 5, 0] } // Shake
        },
        ai: {
            icon: <Zap className="text-blue-500 fill-blue-500" />,
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            animation: { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }, // Pulse
            transition: { repeat: Infinity, duration: 1.5 }
        },
        whatsapp: {
            icon: <MessageCircle className="text-green-600 fill-green-100" />,
            bg: 'bg-green-50',
            border: 'border-green-200',
            animation: { y: [0, -3, 0] } // Bounce
        }
    };

    const style = config[type] || config.success;

    return (
        <motion.div
            layout
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${style.bg} ${style.border} min-w-[300px] backdrop-blur-sm`}
        >
            <motion.div
                animate={style.animation}
                transition={style.transition || { duration: 0.4 }}
            >
                {style.icon}
            </motion.div>
            <span className="text-sm font-medium text-gray-700">{message}</span>
        </motion.div>
    );
};
