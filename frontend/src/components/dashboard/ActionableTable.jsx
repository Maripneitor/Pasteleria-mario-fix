import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Printer, MessageCircle, Edit } from 'lucide-react';

const ActionableTable = ({ data, onEdit, onPrint, onWhatsApp, onViewDetails }) => {
    // Dropdown State handling
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (id, e) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    // Close dropdown when clicking outside (using window listener in parent or simple backdrop here)
    // For simplicity, we assume clicking a row closes it if handled in parent, or we can add an overlay.

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-visible relative">
            {/* Invisible Backdrop to close menu */}
            {activeDropdown && (
                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
            )}

            <div className="overflow-x-auto rounded-2xl">
                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                    <thead className="bg-bakery-50 dark:bg-slate-800 text-xs uppercase font-bold text-bakery-accent tracking-wider">
                        <tr>
                            <th className="px-6 py-5">Folio</th>
                            <th className="px-6 py-5">Cliente</th>
                            <th className="px-6 py-5">Entrega</th>
                            <th className="px-6 py-5">Total</th>
                            <th className="px-6 py-5">Estado</th>
                            <th className="px-6 py-5 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {data.map((item) => (
                            <motion.tr
                                key={item.id || item._id || item.folioNumber}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                onClick={() => onViewDetails && onViewDetails(item)}
                                className="cursor-pointer transition-colors relative z-0"
                            >
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                    #{item.folioNumber}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-bakery-primary/80 to-bakery-primary flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                            {item.clientName?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {item.clientName}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-bakery-accent/80 font-medium">
                                    {item.deliveryDate}
                                </td>

                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                    ${item.total}
                                </td>

                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5
                                        ${item.status === 'Entregado' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            item.status === 'Pendiente' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                item.status === 'Cancelado' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Entregado' ? 'bg-green-500' :
                                            item.status === 'Pendiente' ? 'bg-amber-500' :
                                                item.status === 'Cancelado' ? 'bg-red-500' : 'bg-blue-500'
                                            }`}></span>
                                        {item.status}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-right relative">
                                    <button
                                        onClick={(e) => toggleDropdown(item.id || item.folioNumber, e)}
                                        className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-bakery-primary transition-colors"
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    <AnimatePresence>
                                        {activeDropdown === (item.id || item.folioNumber) && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                transition={{ duration: 0.1 }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="absolute right-8 top-8 z-50 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden"
                                            >
                                                <div className="py-1">
                                                    <button onClick={() => onEdit(item)} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-bakery-50 hover:text-bakery-primary flex items-center gap-2">
                                                        <Edit size={16} /> Editar
                                                    </button>
                                                    <button onClick={() => onPrint(item)} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-bakery-50 hover:text-bakery-primary flex items-center gap-2">
                                                        <Printer size={16} /> Imprimir Ticket
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (onWhatsApp) {
                                                                onWhatsApp(item);
                                                            } else {
                                                                // Default behavior: Open WhatsApp with template
                                                                const message = `Hola ${item.clientName}, tu pedido #${item.folioNumber} de ${Array.isArray(item.cakeFlavor) ? item.cakeFlavor.join(', ') : item.cakeFlavor} ya está listo para entrega en La Fiesta.`;
                                                                let phone = item.clientPhone ? String(item.clientPhone).replace(/\D/g, '') : "";
                                                                // Auto-fix for Mexican numbers (10 digits -> add 52)
                                                                if (phone.length === 10) phone = '52' + phone;

                                                                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                                                            }
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                                    >
                                                        <MessageCircle size={16} /> WhatsApp
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActionableTable;
