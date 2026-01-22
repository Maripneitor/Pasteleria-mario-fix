import React, { useState, useEffect } from 'react';
import { Users, Search, Star } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Clients = () => {
    const { user, currentBranch } = useAuth();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('/clients');
                setClients(response.data || []);
            } catch (error) {
                console.error("Error al cargar clientes:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && currentBranch) {
            fetchClients();
        }
    }, [user, currentBranch]);

    return (
        <div className="p-6 min-h-screen bg-gray-50 dark:bg-bakery-950 transition-colors">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                    <Users className="text-blue-500" />
                    Clientes Frecuentes
                </h1>

                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Nombre</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Teléfono</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Pedidos</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Nivel</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Última Compra</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                        {clients.map((client) => (
                            <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="p-4 font-medium text-gray-800 dark:text-white">{client.name}</td>
                                <td className="p-4 text-gray-500 dark:text-gray-400">{client.phone}</td>
                                <td className="p-4 text-gray-800 dark:text-white font-bold">{client.orders}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${client.tier === 'Platinum' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' :
                                        client.tier === 'Gold' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                                            'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                                        }`}>
                                        {client.tier}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{client.lastOrder}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clients;
