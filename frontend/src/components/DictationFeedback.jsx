import React from 'react';
import { Mic, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const DictationFeedback = ({ status = 'idle', message = '' }) => {
    // status: 'idle' | 'listening' | 'processing' | 'success' | 'error'

    if (status === 'idle') return null;

    return (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className={`
                flex items-center gap-3 px-6 py-4 rounded-full shadow-lg border
                ${status === 'listening' ? 'bg-bakery-cream border-bakery-accent text-bakery-text' : ''}
                ${status === 'processing' ? 'bg-bakery-highlight border-bakery-accent text-bakery-text' : ''}
                ${status === 'success' ? 'bg-bakery-success/20 border-bakery-success text-green-800' : ''}
                ${status === 'error' ? 'bg-bakery-error/20 border-bakery-error text-red-800' : ''}
            `}>

                {status === 'listening' && (
                    <div className="relative">
                        <span className="absolute -inset-1 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                        <Mic className="h-5 w-5 text-red-500 relative z-10" />
                    </div>
                )}

                {status === 'processing' && (
                    <Loader2 className="h-5 w-5 animate-spin text-bakery-accent" />
                )}

                {status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                )}

                {status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                )}

                <span className="font-medium text-sm">
                    {message || (
                        status === 'listening' ? 'Escuchando...' :
                            status === 'processing' ? 'Procesando pedido...' :
                                status === 'success' ? 'Pedido actualizado' :
                                    'Error'
                    )}
                </span>
            </div>
        </div>
    );
};

export default DictationFeedback;
