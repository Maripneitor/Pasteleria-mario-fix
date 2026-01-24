import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AnimatedInput from '../components/ui/AnimatedInput';
import BakeryButton from '../components/ui/BakeryButton';
import { User, Phone, Search, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // New Client Form
    const [newClient, setNewClient] = useState({ name: '', phone: '', phone2: '', email: '', address: '' });

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        if (!search) {
            setFilteredClients(clients);
        } else {
            const q = search.toLowerCase();
            setFilteredClients(clients.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.phone.includes(q)
            ));
        }
    }, [search, clients]);

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients');
            setClients(response.data);
            setFilteredClients(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching clients:", error);
            setLoading(false);
        }
    };

    const handleCreateClient = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/clients', newClient);
            setClients([response.data, ...clients]);
            setIsCreating(false);
            setNewClient({ name: '', phone: '', phone2: '', email: '', address: '' });
            alert('Cliente registrado exitosamente');
        } catch (error) {
            alert('Error al registrar cliente: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-800 dark:text-white">Directorio de Clientes</h1>
                    <p className="text-gray-500 dark:text-gray-400">Gestiona tu base de datos de clientes.</p>
                </div>
                <BakeryButton variant="solid" onClick={() => setIsCreating(true)}>
                    <Plus size={18} className="mr-2" /> Nuevo Cliente
                </BakeryButton>
            </header>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre o teléfono..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-bakery-primary/50 outline-none transition-all"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-bakery-primary" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredClients.map(client => (
                        <motion.div
                            key={client.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-bakery-100 dark:bg-bakery-900/30 text-bakery-primary flex items-center justify-center font-bold text-lg">
                                        {client.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-gray-200">{client.name}</h3>
                                        <span className="text-xs text-gray-400">Cliente #{client.id}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mt-3">
                                <div className="flex items-center gap-2">
                                    <Phone size={14} />
                                    <a href={`tel:${client.phone}`} className="hover:text-bakery-primary">{client.phone}</a>
                                </div>
                                {client.email && (
                                    <div className="flex items-center gap-2">
                                        <span className="opacity-75">✉️</span>
                                        <span>{client.email}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create Client Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl"
                        >
                            <h2 className="text-xl font-bold mb-4">Registrar Nuevo Cliente</h2>
                            <form onSubmit={handleCreateClient} className="space-y-4">
                                <AnimatedInput
                                    label="Nombre Completo"
                                    value={newClient.name}
                                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                    required
                                />
                                <AnimatedInput
                                    label="Teléfono (WhatsApp)"
                                    value={newClient.phone}
                                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                    required
                                />
                                <AnimatedInput
                                    label="Correo Electrónico (Opcional)"
                                    type="email"
                                    value={newClient.email}
                                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                />
                                <div className="flex justify-end gap-2 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                    >
                                        Cancelar
                                    </button>
                                    <BakeryButton type="submit" variant="solid">Guardar Cliente</BakeryButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Clients;
