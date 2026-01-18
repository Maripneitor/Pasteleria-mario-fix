import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Calendar,
    BookOpen, // Folios alias
    PlusCircle,
    Trello, // Kanban alias
    BarChart2,
    Package,
    Users,
    Mail,
    LogOut,
    Menu,
    X,
    Code // Developer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TorchToggle from './ui/TorchToggle';

const NAV_ITEMS = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Folios', path: '/folios', icon: BookOpen },
    { name: 'Nuevo Pedido', path: '/folio/nuevo', icon: PlusCircle },
    { name: 'Calendario', path: '/calendario', icon: Calendar },
    { name: 'Producción', path: '/produccion', icon: Trello },
    { name: 'Estadísticas', path: '/estadisticas', icon: BarChart2 },
    { name: 'Inventario', path: '/inventario', icon: Package },
    { name: 'Clientes', path: '/clientes', icon: Users },
];

const AppNavigation = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isLinkActive = (path) => location.pathname === path;

    // Filter items based on role if needed (Owner/Dev extras)
    const filteredItems = [...NAV_ITEMS];
    if (user?.role === 'Desarrollador') {
        filteredItems.push({ name: 'Dev Console', path: '/dev-dashboard', icon: Code });
    }
    if (user?.role === 'Dueño' || user?.role === 'Administrador' || user?.role === 'Vendedor') {
        filteredItems.push({ name: 'Bandeja IA', path: '/bandeja-ia', icon: Mail });
    }

    // Role display Badge
    const roleBadge = (
        <div className="px-4 py-2 bg-bakery-cream dark:bg-dark-surface rounded-lg mb-4 text-center border border-bakery-accent/20">
            <p className="text-xs text-bakery-muted uppercase font-bold tracking-widest">{user?.role || 'Guest'}</p>
            <p className="font-serif text-bakery-chocolate dark:text-dark-text font-bold truncate">{user?.username || 'Usuario'}</p>
        </div>
    );

    return (
        <>
            {/* --- MOBILE TOP BAR --- */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-burnt-wood border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-50">
                <span className="font-serif font-bold text-xl text-bakery-chocolate dark:text-gray-200">Pastelería Mario</span>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-bakery-chocolate dark:text-gray-200"
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* --- MOBILE DRAWER --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 bg-white dark:bg-burnt-wood z-40 pt-20 px-6 flex flex-col md:hidden"
                    >
                        {roleBadge}
                        <nav className="flex-1 space-y-2 overflow-y-auto">
                            {filteredItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                        ${isActive
                                            ? 'bg-bakery-accent text-white shadow-md'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-bakery-cream dark:hover:bg-dark-surface'}
                                    `}
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </NavLink>
                            ))}
                        </nav>
                        <div className="py-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <TorchToggle />
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 text-red-500 font-medium p-2"
                            >
                                <LogOut size={20} />
                                Salir
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white dark:bg-burnt-wood border-r border-gray-200 dark:border-r-gray-800 z-30 transition-colors duration-300">
                <div className="p-6">
                    <h1 className="font-serif font-bold text-2xl text-bakery-chocolate dark:text-bakery-cream text-center mb-6">
                        Pastelería <span className="text-bakery-accent text-3xl block">Mario</span>
                    </h1>
                    {roleBadge}
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {filteredItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                                    ? 'bg-bakery-accent text-white shadow-bakery-soft font-bold translate-x-1'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-bakery-cream dark:hover:bg-dark-surface hover:text-bakery-chocolate dark:hover:text-gray-200'}
                            `}
                        >
                            <item.icon size={20} className="stroke-[1.5px] group-hover:stroke-2" />
                            <span className="text-sm tracking-wide">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-6">
                    <TorchToggle />

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium w-full justify-center py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                        <LogOut size={18} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AppNavigation;
