import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Zap, MessageCircle, Flame, AlertOctagon, PenTool } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message, customTitle, context = {}) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message, customTitle, context }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, context.duration || 4000);
    }, []);

    const showSuccess = (msg) => addToast('success', msg);
    const showError = (msg) => addToast('error', msg);
    const showWarning = (msg) => addToast('warning', msg);
    const showWhatsapp = (msg) => addToast('whatsapp', msg);
    const showProduction = (msg, title) => addToast('production', msg, title);

    // --- Specialized Context Toasts ---

    const showAiActive = (msg) => addToast('ai', msg, null, { isTyping: true });

    const showContextToast = (type, context) => {
        let message = '';
        let title = '';

        switch (context.action) {
            case 'reading':
                message = "Don Mario está leyendo tu nota...";
                title = "Analizando Pedido";
                addToast('ai', message, title, { isTyping: true });
                break;
            case 'low_stock':
                message = `¡Atención! Se nos acaba ${context.item} para este pedido.`;
                title = "Stock Bajo";
                addToast('error', message, title); // Use error style for urgency
                break;
            case 'order_ready':
                message = `El pastel de ${context.client} está listo para entrega.`;
                title = "¡Listo!";
                addToast('success', message, title);
                break;
            default:
                addToast(type, "Notificación del sistema");
        }
    };

    return (
        <ToastContext.Provider value={{ showSuccess, showError, showWarning, showAiActive, showWhatsapp, showProduction, showContextToast }}>
            {children}
            {/* Position: Top Center for Desktop, Bottom Center for Mobile (visually safer) */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none w-full max-w-md px-4 md:top-8">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} {...toast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ type, message, customTitle, context }) => {
    const variants = {
        initial: { opacity: 0, y: -50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } }
    };

    const config = {
        success: {
            icon: <CheckCircle className="text-green-500" size={24} />,
            bg: 'bg-white',
            border: 'border-green-100',
            titleColor: 'text-green-800',
            defaultTitle: '¡Éxito!',
            shadow: 'shadow-green-100/50'
        },
        error: {
            icon: <AlertOctagon className="text-red-500" size={24} />,
            bg: 'bg-white',
            border: 'border-red-100',
            titleColor: 'text-red-800',
            defaultTitle: 'Error detectado',
            shadow: 'shadow-red-100/50'
        },
        warning: {
            icon: <AlertOctagon className="text-amber-500" size={24} />,
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            titleColor: 'text-amber-800',
            defaultTitle: 'Advertencia',
            shadow: 'shadow-amber-100/50'
        },
        ai: {
            icon: <Zap className="text-blue-500 fill-blue-500" size={24} />,
            bg: 'bg-blue-50', // Light blue
            border: 'border-blue-100',
            titleColor: 'text-blue-900',
            defaultTitle: 'IA Activa',
            shadow: 'shadow-blue-100/50',
            typingEffect: true
        },
        production: {
            icon: <Flame className="text-orange-500 fill-orange-100 animate-pulse" size={24} />,
            bg: 'bg-orange-50', // Warm background
            border: 'border-orange-200',
            titleColor: 'text-orange-900',
            defaultTitle: 'Producción',
            shadow: 'shadow-orange-200/50'
        },
        whatsapp: {
            icon: <MessageCircle className="text-green-600 fill-green-100" size={24} />,
            bg: 'bg-white',
            border: 'border-green-200',
            titleColor: 'text-green-800',
            defaultTitle: 'WhatsApp',
            shadow: 'shadow-green-100/50'
        }
    };

    const style = config[type] || config.success;
    const title = customTitle || style.defaultTitle;

    return (
        <motion.div
            layout
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`pointer-events-auto flex items-start gap-4 p-4 rounded-xl shadow-xl border ${style.bg} ${style.border} ${style.shadow} w-full backdrop-blur-md`}
        >
            <div className="mt-1 flex-shrink-0 relative">
                {style.icon}
                {context?.isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm"
                    >
                        <PenTool size={10} className="text-blue-500" />
                    </motion.div>
                )}
            </div>
            <div className="flex-1">
                <h4 className={`font-bold text-sm ${style.titleColor}`}>{title}</h4>
                <div className="text-sm text-gray-600 leading-tight mt-1">
                    {message}
                    {context?.isTyping && (
                        <span className="inline-flex ml-1">
                            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
                            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>.</motion.span>
                            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>.</motion.span>
                        </span>
                    )}
                </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle size={16} />
            </button>
        </motion.div>
    );
};
