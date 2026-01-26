import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, User, ShoppingBag, FileText, X, Command } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../ui/GlassCard';

const ACTIONS = [
    { id: 'new-order', label: 'Nuevo Pedido', icon: Plus, path: '/folio/nuevo', roles: ['all'] },
    { id: 'folios', label: 'Ver Pedidos', icon: ShoppingBag, path: '/folios', roles: ['all'] },
    { id: 'clients', label: 'Clientes', icon: User, path: '/clientes', roles: ['all'] },
    { id: 'users', label: 'Gestión de Usuarios', icon: User, path: '/admin/users', roles: ['admin', 'owner', 'developer'] },
    { id: 'reports', label: 'Reportes', icon: FileText, path: '/estadisticas', roles: ['admin', 'owner', 'developer'] },
];

const QuickActions = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { user, hasPermission } = useAuth();

    // Keyboard Shortcut Handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                navigate('/folio/nuevo');
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);

    // Filter Actions
    const filteredActions = ACTIONS.filter(action => {
        const hasRole = action.roles.includes('all') ||
            (user?.role && action.roles.some(r => user.role.toLowerCase().includes(r))) ||
            (action.id === 'users' && hasPermission('admin.access')); // Fallback logic

        const matchesSearch = action.label.toLowerCase().includes(searchTerm.toLowerCase());

        return hasRole && matchesSearch;
    });

    const handleAction = (path) => {
        navigate(path);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <>
            {/* Floating Trigger Button (Mobile/Desktop) */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-40 flex items-center justify-center group"
                title="Acciones Rápidas (Cmd+K)"
            >
                <Command size={24} />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap group-hover:ml-2">
                    Acciones
                </span>
            </button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-lg"
                        >
                            <GlassCard className="flex flex-col max-h-[60vh]">
                                {/* Header / Search */}
                                <div className="flex items-center gap-3 p-4 border-b border-border dark:border-white/10">
                                    <Search className="text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="¿Qué necesitas hacer?..."
                                        className="flex-1 bg-transparent border-none outline-none text-lg text-text-primary placeholder-gray-400"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Results List */}
                                <div className="overflow-y-auto p-2">
                                    {filteredActions.length > 0 ? (
                                        <div className="space-y-1">
                                            {filteredActions.map((action, index) => (
                                                <button
                                                    key={action.id}
                                                    onClick={() => handleAction(action.path)}
                                                    className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-left transition-colors group"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-surface-muted dark:bg-black/20 flex items-center justify-center text-gray-500 group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-colors">
                                                        <action.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-text-primary">{action.label}</div>
                                                        <div className="text-xs text-text-secondary">Ir a {action.path}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500">
                                            No se encontraron acciones.
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="p-3 bg-gray-50 dark:bg-black/20 border-t border-border dark:border-white/10 text-xs text-gray-400 flex justify-between rounded-b-xl">
                                    <span>Seleccionar <kbd className="bg-white dark:bg-gray-700 px-1 rounded">↵</kbd></span>
                                    <span>Cerrar <kbd className="bg-white dark:bg-gray-700 px-1 rounded">Esc</kbd></span>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default QuickActions;
