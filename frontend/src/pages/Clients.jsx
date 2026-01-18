import React from 'react';
import { Users, Search, Star } from 'lucide-react';
import { mockClients } from '../utils/mockData';

const Clients = () => {
    return (
        <div className="p-6 bg-bakery-cream min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-serif font-bold text-bakery-text flex items-center gap-3">
                    <Users className="text-bakery-accent" />
                    Clientes Frecuentes
                </h1>

                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-bakery-accent"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Nombre</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Teléfono</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Pedidos</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Nivel</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Última Compra</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {mockClients.map((client) => (
                            <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 font-medium text-gray-800">{client.name}</td>
                                <td className="p-4 text-gray-500">{client.phone}</td>
                                <td className="p-4 text-gray-800 font-bold">{client.orders}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${client.tier === 'Platinum' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                            client.tier === 'Gold' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                'bg-gray-50 text-gray-700 border-gray-200'
                                        }`}>
                                        {client.tier}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 text-sm">{client.lastOrder}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clients;
