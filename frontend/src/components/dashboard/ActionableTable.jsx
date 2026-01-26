import Skeleton from '../ui/Skeleton';

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
                                {data.map((item) => (
                                    <motion.tr
                                        key={item.id || item._id || item.folioNumber}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        layout
                                        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                    // ... existing props
                                    >
                                        {/* ... existing cells ... */}
                                    </motion.tr>
                                ))}
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
