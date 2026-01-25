import React, { useState, useEffect } from 'react';
import { Plus, Trash, Edit2, Save, X } from 'lucide-react';
import api from '../api/axios';

// Mock data for initial state (in a real app, this would come from an API)
const INITIAL_FLAVORS = [
    { id: 1, name: 'Vainilla', available: true },
    { id: 2, name: 'Chocolate', available: true },
    { id: 3, name: 'Moka', available: true },
    { id: 4, name: 'Red Velvet', available: true },
];

const INITIAL_FILLINGS = [
    { id: 1, name: 'Fresa Natural', available: true },
    { id: 2, name: 'Durazno', available: true },
    { id: 3, name: 'Nuez', available: true },
    { id: 4, name: 'Cajeta', available: true },
];

const BakeryConfig = () => {
    const [flavors, setFlavors] = useState([]);
    const [fillings, setFillings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            const [flavRes, fillRes] = await Promise.all([
                api.get('/ingredients/flavors'),
                api.get('/ingredients/fillings')
            ]);
            setFlavors(flavRes.data);
            setFillings(fillRes.data);
        } catch (error) {
            console.error("Error loading config", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleUpdate = () => fetchConfig();

    if (loading) return <div className="p-10 text-center">Cargando configuración...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Configuración de Pastelería</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sabores Section */}
                <ConfigSection
                    title="Sabores de Pan"
                    items={flavors}
                    onUpdate={handleUpdate}
                    endpoint="/ingredients/flavors"
                    color="blue"
                />

                {/* Rellenos Section */}
                <ConfigSection
                    title="Rellenos"
                    items={fillings}
                    onUpdate={handleUpdate}
                    endpoint="/ingredients/fillings"
                    color="purple"
                />
            </div>
        </div>
    );
};

const ConfigSection = ({ title, items, onUpdate, endpoint, color }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newItemName, setNewItemName] = useState('');

    const handleAdd = async () => {
        if (!newItemName.trim()) return;
        try {
            await api.post(endpoint, { name: newItemName, available: true });
            setNewItemName('');
            setIsAdding(false);
            onUpdate();
        } catch (error) {
            alert('Error al agregar: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este ítem?')) {
            try {
                await api.delete(`${endpoint}/${id}`);
                onUpdate();
            } catch (error) {
                alert('Error al eliminar');
            }
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
            <div className={`p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-${color}-50 dark:bg-${color}-900/10`}>
                <h2 className={`font-bold text-lg text-${color}-700 dark:text-${color}-300`}>{title}</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className={`p-2 bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-300 rounded-lg hover:bg-${color}-200 dark:hover:bg-${color}-900/50 transition-colors`}
                >
                    <Plus size={20} />
                </button>
            </div>

            <div className="p-4">
                {isAdding && (
                    <div className="flex gap-2 mb-4 animate-in slide-in-from-top-2 fade-in duration-200">
                        <input
                            autoFocus
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            className="flex-1 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nombre..."
                        />
                        <button onClick={handleAdd} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                            <Save size={18} />
                        </button>
                        <button onClick={() => setIsAdding(false)} className="p-2 bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600">
                            <X size={18} />
                        </button>
                    </div>
                )}

                <div className="space-y-2">
                    {items.map(item => (
                        <div key={item.id} className="group flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                            <span className="font-medium text-gray-700 dark:text-gray-200">{item.name}</span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-4">No hay ítems registrados.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BakeryConfig;
