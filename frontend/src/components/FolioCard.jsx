import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Phone, Cake } from 'lucide-react';

const FolioCard = ({ folio }) => {
    // Helper for status colors
    // Helper for status colors
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Nuevo': return 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-700/10';
            case 'Pendiente': return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-700/10';
            case 'En Producción': return 'bg-orange-50 text-orange-700 border-orange-200 ring-1 ring-orange-700/10';
            case 'Listo para Entrega': return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-700/10';
            case 'Entregado': return 'bg-gray-50 text-gray-600 border-gray-200';
            case 'Cancelado': return 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-700/10 opacity-75';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    // Urgency Check
    const isToday = () => {
        if (!folio.deliveryDate) return false;
        const today = new Date().toISOString().split('T')[0];
        return folio.deliveryDate.startsWith(today); // Simple string match YYYY-MM-DD
    };


    // Safe accessors
    const flavor = Array.isArray(folio.cakeFlavor) ? folio.cakeFlavor[0] : (folio.cakeFlavor || 'Sin Sabor');

    const getFillingName = () => {
        if (Array.isArray(folio.filling) && folio.filling[0]) return folio.filling[0].name || folio.filling[0];
        return folio.filling || 'Sin Relleno';
    }

    const phone = folio.client?.phone || 'Sin Teléfono';
    const clientName = folio.client?.name || 'Cliente Casual';

    // Balance validation
    const balance = folio.balance !== undefined ? folio.balance : (folio.total - (folio.advancePayment || 0));

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ rotate: 1, scale: 1.02, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`bg-white rounded-xl shadow-sm border overflow-hidden relative group h-full flex flex-col ${isToday() ? 'border-bakery-primary ring-2 ring-bakery-primary/20 bg-bakery-primary/5' : 'border-gray-100'}`}
        >
            <div className="p-5 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Folio</span>
                            {isToday() && (
                                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-rose-200">
                                    ¡HOY!
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-serif font-bold text-bakery-text leading-none">#{folio.folioNumber}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(folio.status)}`}>
                        {folio.status}
                    </span>
                </div>

                {/* Body */}
                <div className="space-y-4 mb-4 flex-grow">
                    {/* Client */}
                    <div className="flex items-start gap-3">
                        <User size={18} strokeWidth={2} className="text-bakery-muted mt-0.5 shrink-0" />
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-gray-800 truncate" title={clientName}>{clientName}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Phone size={12} strokeWidth={2} />
                                <span>{phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Date/Time */}
                    <div className="flex items-center gap-3">
                        <Calendar size={18} strokeWidth={2} className="text-bakery-muted shrink-0" />
                        <div className="text-sm text-gray-600">
                            <span className="font-medium text-gray-800">{folio.deliveryDate}</span> <span className="text-gray-300 mx-1">|</span> {folio.deliveryTime}
                        </div>
                    </div>

                    {/* Cake Details */}
                    <div className="bg-bakery-cream/50 p-3 rounded-lg border border-bakery-highlight/50">
                        <div className="flex items-start gap-2 mb-1">
                            <Cake size={16} strokeWidth={2} className="text-bakery-accent mt-0.5 shrink-0" />
                            <div>
                                <span className="text-sm font-bold text-gray-800 block leading-tight">{flavor}</span>
                                <span className="text-xs text-gray-500 block">Relleno: {getFillingName()}</span>
                                <span className="text-xs text-gray-500 block mt-0.5">{folio.persons} personas</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-gray-50 flex justify-between items-end mt-auto">
                    <div>
                        <p className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wide">Total</p>
                        <p className="text-lg font-bold text-gray-800 leading-none">${folio.total}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wide">Pendiente</p>
                        <p className={`text-sm font-bold leading-none ${balance > 0 ? 'text-bakery-error' : 'text-bakery-success'}`}>
                            ${balance}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FolioCard;
