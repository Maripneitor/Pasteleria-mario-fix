import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, MessageSquare, ClipboardList, PlusCircle, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Switch from '../ui/Switch';
import BranchSelector from '../BranchSelector';
import RoleBasedView from '../auth/RoleBasedView';

const ResponsiveNavigation = () => {
    const { user, logout } = useAuth();
    const { toggleTheme } = useTheme();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        // Developer
        { name: 'Dev Dashboard', href: '/dashboard/developer', icon: LayoutDashboard, permission: 'system.debug' },
        { name: 'System Debug', href: '/system-health', icon: ClipboardList, permission: 'system.debug' },

        // Owner/Admin
        { name: 'Panel Dueño', href: '/dashboard/owner', icon: LayoutDashboard, permission: 'dashboard.view_stats' },
        { name: 'Usuarios', href: '/admin/users', icon: ClipboardList, permission: 'users.manage' }, // Added based on context

        // Production / Operation
        { name: 'Producción', href: '/produccion', icon: Calendar, permission: 'folios.read' },
        { name: 'Folios', href: '/folios', icon: ClipboardList, permission: 'folios.read' },
        { name: 'Nuevo Folio', href: '/folio/nuevo', icon: PlusCircle, permission: 'folios.create' },
        { name: 'Clientes', href: '/clientes', icon: ClipboardList, permission: 'clients.read' },

        // Common
        { name: 'Calendario', href: '/calendario', icon: Calendar, permission: 'folios.read' },
        { name: 'Bandeja IA', href: '/bandeja-ia', icon: MessageSquare, permission: 'folios.create' },
    ];

    const isActive = (path) => location.pathname === path;

    // Filter items based ONLY on dashboardConfig (permissions handled by RoleBasedView)
    const visibleNav = navigation.filter(item => {
        // Config Check (Disabled Tabs)
        let configKey = null;
        if (item.href === '/inventario') configKey = 'inventory';
        if (item.href === '/clientes') configKey = 'clients';

        const disabledTabs = user?.dashboardConfig?.disabledTabs || [];
        const isHidden = configKey && disabledTabs.includes(configKey);

        return !isHidden;
    });

    // Sidebar Content (Reused for Desktop and Mobile Drawer)
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-bakery-50 dark:bg-bakery-950 transition-colors duration-300">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                        P
                    </div>
                    <span className="text-xl font-bold text-bakery-text dark:text-bakery-milk tracking-tight font-serif">
                        Pastelería
                    </span>
                </div>
                <BranchSelector />
            </div>

            {/* Links */}
            <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
                {visibleNav.map((item) => (
                    <RoleBasedView key={item.name} permission={item.permission}>
                        <Link
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium border-l-4 ${isActive(item.href)
                                ? 'bg-blue-50 text-blue-600 border-blue-500 dark:bg-bakery-800 dark:text-blue-400 dark:border-blue-500'
                                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-bakery-800 dark:hover:text-bakery-milk'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    </RoleBasedView>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 mt-auto">

                {/* User Profile */}
                {/* User Profile */}
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 dark:bg-black/20 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">{user?.username || 'Usuario'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 truncate">{user?.role || 'Rol'}</p>
                    </div>
                </Link>

                {/* Dark Mode Toggle */}
                <div className="flex justify-center py-4 border-t border-gray-100 dark:border-gray-800">
                    <Switch
                        checked={user?.theme === 'dark'}
                        onChange={toggleTheme}
                        label={user?.theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
                    />
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
        </div >
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
