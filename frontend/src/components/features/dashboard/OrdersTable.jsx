import React from 'react';

const statusConfig = {
    pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: 'ClockIcon' },
    preparing: { label: 'Preparando', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'CakeIcon' },
    delivery: { label: 'En Camino', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: 'TruckIcon' },
    completed: { label: 'Entregado', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: 'CheckCircleIcon' },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800 border-red-200', icon: 'XCircleIcon' },
};

const OrdersTable = ({ orders }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pedidos Recientes</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">ID Pedido</th>
                            <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Cliente</th>
                            <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Productos</th>
                            <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Total</th>
                            <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {orders.map((order) => {
                            const status = statusConfig[order.status] || statusConfig.pending;
                            return (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {order.id}
                                        {order.isUrgent && (
                                            <span className="relative flex h-2 w-2 inline-flex ml-2 top-[-2px]">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                {order.customer.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                            </div>
                                            {order.customer}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.items}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTable;
