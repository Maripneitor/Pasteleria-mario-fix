import React, { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, AlertOctagon, Zap, MessageCircle, Flame } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {

    const showSuccess = (msg, title) => toast.success(msg, {
        style: { border: '1px solid #d1fae5', padding: '16px', color: '#065f46' },
        iconTheme: { primary: '#10b981', secondary: '#FFFAEE' },
    });

    const showError = (msg) => toast.error(msg, {
        style: { border: '1px solid #fee2e2', padding: '16px', color: '#991b1b' },
        iconTheme: { primary: '#ef4444', secondary: '#FFFAEE' },
    });

    const showWhatsapp = (msg) => toast(msg, {
        icon: <MessageCircle className="text-green-500" size={20} />,
        style: { border: '1px solid #dcfce7', padding: '16px', color: '#166534' },
    });

    const showProduction = (msg, title) => toast(
        <div className="flex flex-col">
            <span className="font-bold text-orange-900">{title || 'Producción'}</span>
            <span className="text-orange-800 text-sm">{msg}</span>
        </div>,
        {
            icon: <Flame className="text-orange-500 animate-pulse" size={20} />,
            style: { border: '1px solid #ffedd5', background: '#fff7ed', padding: '12px' },
            duration: 5000,
        }
    );

    const showAiActive = (msg) => toast(msg, {
        icon: <Zap className="text-blue-500" size={20} />,
        style: { border: '1px solid #dbeafe', color: '#1e40af' },
    });

    const showContextToast = (type, context) => {
        let message = '';
        switch (context.action) {
            case 'reading':
                showAiActive("Don Mario está leyendo tu nota...");
                break;
            case 'low_stock':
                message = `¡Atención! Se nos acaba ${context.item} para este pedido.`;
                showError(message);
                break;
            case 'order_ready':
                message = `El pastel de ${context.client} está listo para entrega.`;
                showSuccess(message);
                break;
            default:
                toast(type === 'success' ? 'Operación exitosa' : 'Notificación');
        }
    };

    return (
        <ToastContext.Provider value={{ showSuccess, showError, showAiActive, showWhatsapp, showProduction, showContextToast }}>
            {children}
            <Toaster position="top-center" reverseOrder={false} gutter={8} />
        </ToastContext.Provider>
    );
};
