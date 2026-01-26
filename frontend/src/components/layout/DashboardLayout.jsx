import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { MENU_ITEMS } from '../../config/permissions';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from './Breadcrumbs';
import {
    LayoutDashboard,
    ChefHat,
    Box,
    Settings,
    Bot,
    ShoppingBag,
    LogOut,
    ChevronLeft,
    ChevronRight,
    User,
    Wifi
} from 'lucide-react';
import OfflineBanner from '../common/OfflineBanner';

// Icon mapping based on permissions.js strings
const ICON_MAP = {
    'LayoutDashboard': LayoutDashboard,
    'ChefHat': ChefHat,
    'Box': Box,
    'Settings': Settings,
    'Bot': Bot,
    'ShoppingBag': ShoppingBag,
    'Users': Users
};

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout, getUserRoleLabel } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const location = useLocation();

    const [currentTime, setCurrentTime] = useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // If children are provided, use them. Otherwise, use Outlet.
    const content = children || <Outlet />;

    // Filter menu items based on user role
    const filteredNavigation = MENU_ITEMS.filter(item =>
        user && item.roles.includes(user.role)
    );

    // Provide default icon if not found
    const getIcon = (iconName) => {
        const Icon = ICON_MAP[iconName] || Box;
        return <Icon className="w-6 h-6 flex-shrink-0" />;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: sidebarOpen ? 0 : (window.innerWidth < 768 ? -300 : 0),
                    width: sidebarOpen ? 256 : (window.innerWidth < 768 ? 256 : 80)
                }}
                className={`
                    fixed h-full z-50 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
                    transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
                `}
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {sidebarOpen ? (
                            <motion.span
                                key="full-logo"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xl font-bold text-red-600 whitespace-nowrap"
                            >
                                Pastelería La Fiesta
                            </motion.span>
                        ) : (
                            <motion.span
                                key="mini-logo"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xl font-bold text-red-600"
                            >
                                PLF
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
                    {filteredNavigation.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (location.pathname.startsWith(item.path) && item.path !== '/' && item.path !== '/dashboard') ||
                            (item.path === '/folios' && location.pathname.startsWith('/folio/'));
                        return (
                            <Link key={item.path} to={item.path}>
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${isActive
                                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {getIcon(item.icon)}

                                    {/* Text container with AnimatePresence for smooth hide/show */}
                                    {sidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="font-medium whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                    >
                        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>

                    {sidebarOpen && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={logout}
                            className="w-full mt-4 flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Cerrar Sesión</span>
                        </motion.button>
                    )}
                </div>
            </motion.aside>


            {/* Main Content */}
            <motion.div
                className="flex-1 flex flex-col min-h-screen"
                animate={{ marginLeft: sidebarOpen && window.innerWidth >= 768 ? 256 : (window.innerWidth >= 768 ? 80 : 0) }}
            >
                {/* Navbar */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white hidden sm:block">
                                {filteredNavigation.find(i => i.path === location.pathname)?.label || 'Panel de Control'}
                            </h2>
                            {/* Mobile Title */}
                            <span className="text-lg font-bold text-red-500 sm:hidden">
                                Pastelería La Fiesta
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Clock */}
                        <div className="hidden md:block bg-gray-900 p-2 rounded text-white font-mono">
                            {currentTime.toLocaleTimeString()}
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                            title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
                        >
                            {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.name || 'Usuario'}
                                </p>
                                <p className="text-xs text-gray-500">{getUserRoleLabel()}</p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto w-full relative">
                    <Breadcrumbs />
                    <OfflineBanner />
                    {content}
                </main>
            </motion.div>
        </div>
    );
};

export default DashboardLayout;
