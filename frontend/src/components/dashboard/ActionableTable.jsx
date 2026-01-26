import Skeleton from '../ui/Skeleton';
import { Edit, Eye, Printer, MessageCircle, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ...

const ActionableTable = ({ data, onEdit, onPrint, onWhatsApp, onViewDetails, isLoading }) => {
    // Dropdown State handling
    // ...

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-visible relative">
            {/* ... Backdrop ... */}

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
                        {isLoading ? (
                            // Skeleton Rows
                            [...Array(5)].map((_, i) => (
                                <tr key={`skeleton-${i}`}>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-8 h-8 rounded-full" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></td>
                                </tr>
                            ))
                        ) : (
                            <AnimatePresence>
                                {data.map((item) => {
                                    const getStatusStyle = (status) => {
                                        switch (status) {
                                            case 'Nuevo': return 'bg-blue-100 text-blue-800';
                                            case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
                                            case 'En Producción': return 'bg-orange-100 text-orange-800';
                                            case 'Listo para Entrega': return 'bg-bakery-success text-green-900';
                                            case 'Entregado': return 'bg-gray-100 text-gray-800';
                                            case 'Cancelado': return 'bg-red-100 text-red-800';
                                            default: return 'bg-gray-50 text-gray-600';
                                        }
                                    };

                                    return (
                                        <motion.tr
                                            key={item.id || item._id || item.folioNumber}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            layout
                                            className="hover:bg-bakery-50 dark:hover:bg-slate-800/50 transition-colors group"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                #{item.folioNumber}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-200">{item.clientName || 'Cliente Casual'}</div>
                                                    <div className="text-xs text-gray-500">{item.clientPhone}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {item.deliveryDate} <span className="text-xs text-gray-400">| {item.deliveryTime}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-medium text-gray-800 dark:text-gray-300">
                                                ${item.total}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusStyle(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {onViewDetails && (
                                                        <button onClick={() => onViewDetails(item)} className="p-1.5 text-gray-400 hover:text-bakery-primary hover:bg-bakery-100 rounded-lg transition-colors" title="Ver Detalles">
                                                            <Eye size={18} />
                                                        </button>
                                                    )}
                                                    {onWhatsApp && (
                                                        <button onClick={() => onWhatsApp(item)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Enviar WhatsApp">
                                                            <MessageCircle size={18} />
                                                        </button>
                                                    )}
                                                    {onPrint && (
                                                        <button onClick={() => onPrint(item)} className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" title="Imprimir Ticket">
                                                            <Printer size={18} />
                                                        </button>
                                                    )}
                                                    {onEdit && (
                                                        <button onClick={() => onEdit(item)} className="p-1.5 text-gray-400 hover:text-bakery-accent hover:bg-orange-50 rounded-lg transition-colors" title="Editar">
                                                            <Edit size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                        {!isLoading && data.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                    No hay datos disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActionableTable;
