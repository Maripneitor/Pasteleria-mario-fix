import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, MessageSquare, ClipboardList, PlusCircle, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import TorchCheckbox from './TorchCheckbox';

const ResponsiveNavigation = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        // Developer
        { name: 'Dev Dashboard', href: '/dashboard/developer', icon: LayoutDashboard, roles: ['Desarrollador'] },
        { name: 'System Debug', href: '/system-health', icon: ClipboardList, roles: ['Desarrollador'] },

        // Owner
        { name: 'Panel Dueño', href: '/dashboard/owner', icon: LayoutDashboard, roles: ['Dueño', 'Administrador'] },
        { name: 'Inventario', href: '/inventario', icon: ClipboardList, roles: ['Dueño', 'Administrador'] },
        { name: 'Clientes', href: '/clientes', icon: ClipboardList, roles: ['Dueño', 'Administrador'] },

        // Employee (and Owner/Admin)
        { name: 'Producción', href: '/produccion', icon: Calendar, roles: ['Administrador', 'Vendedor', 'Pastelero', 'Empleado', 'Dueño'] },
        { name: 'Folios', href: '/folios', icon: ClipboardList, roles: ['Administrador', 'Vendedor', 'Pastelero', 'Empleado', 'Dueño'] },
        { name: 'Nuevo Folio', href: '/folio/nuevo', icon: PlusCircle, roles: ['Administrador', 'Vendedor', 'Empleado', 'Dueño'] },

        // Common
        { name: 'Calendario', href: '/calendario', icon: Calendar, roles: ['Administrador', 'Vendedor', 'Pastelero', 'Dueño'] },
        { name: 'Bandeja IA', href: '/bandeja-ia', icon: MessageSquare, roles: ['Administrador', 'Vendedor', 'Dueño'] },
    ];

    const isActive = (path) => location.pathname === path;

    // Filter items based on role AND dashboardConfig
    const filteredNav = navigation.filter(item => {
        // 1. Role Check
        const roleMatches = !item.roles || (user && item.roles.includes(user.role));

        // 2. Config Check (Disabled Tabs)
        // Map menu items to config keys (naive mapping for now, explicitly add keys to nav items later if strictly needed,
        // but let's assume 'clients', 'inventory' match hrefs or names)

        // Let's rely on href to match 'key' from AdminOwnerManagement
        // Keys used there: metrics, inventory, clients, employees
        let configKey = null;
        if (item.href === '/inventario') configKey = 'inventory';
        if (item.href === '/clientes') configKey = 'clients';
        if (item.href === '/recetas') configKey = 'employees'; // Example mapping

        const disabledTabs = user?.dashboardConfig?.disabledTabs || [];
        const isHidden = configKey && disabledTabs.includes(configKey);

        return roleMatches && !isHidden;
    });

    // Sidebar Content (Reused for Desktop and Mobile Drawer)
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-bakery-milk dark:bg-bakery-dark-surface transition-colors duration-300">
            {/* Header */}
            <div className="p-6 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                    P
                </div>
                <span className="text-xl font-bold text-bakery-text dark:text-bakery-dark-text tracking-tight font-serif">
                    Pastelería
                </span>
            </div>

            {/* Links */}
            <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
                {filteredNav.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium border-l-4 ${isActive(item.href)
                            ? 'bg-orange-50 text-orange-600 border-orange-500 dark:bg-bakery-burnt-wood dark:text-bakery-torch-fire dark:border-bakery-torch-fire dark:shadow-[0_0_15px_rgba(230,81,0,0.3)]'
                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-bakery-dark-surface dark:hover:text-gray-200'
                            }`}
                    >
                        <item.icon size={20} />
                        {item.name}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 mt-auto">

                {/* User Profile */}
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 dark:bg-black/20 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">{user?.username || 'Usuario'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 truncate">{user?.role || 'Rol'}</p>
                    </div>
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex justify-center py-4 border-t border-gray-100 dark:border-gray-800">
                    <TorchCheckbox />
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar (lg+) */}
            <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-50 border-r border-gray-200 dark:border-gray-700 shadow-sm">
                <SidebarContent />
            </aside>

            {/* Mobile Header (lg-) */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-bakery-dark-surface border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-40 transition-colors duration-300">
                <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600 dark:text-gray-300 p-2">
                    <Menu size={24} />
                </button>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-lg font-serif">Pastelería</span>
                <div className="w-10" /> {/* Spacer to balance menu button */}
            </header>

            {/* Mobile Drawer (Overlay + Sidebar) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-bakery-dark-surface z-50 lg:hidden shadow-2xl"
                        >
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X size={24} />
                            </button>
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default ResponsiveNavigation;
