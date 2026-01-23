import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import ResponsiveNavigation from './ResponsiveNavigation';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout = ({ children }) => {
    // If children are provided, use them. Otherwise, use Outlet.
    const content = children || <Outlet />;
    const { user } = useAuth();

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-bakery-950 transition-colors duration-300">
            {/* Unified Navigation System - Note: ResponsiveNavigation has fixed positioning on desktop */}
            <ResponsiveNavigation />

            {/* Main Content Area */}
            {/* Added lg:ml-64 to account for fixed sidebar in ResponsiveNavigation */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-64 overflow-hidden relative">
                <header className="h-16 border-b border-gray-100 dark:border-bakery-800 flex items-center px-6 justify-between shrink-0 bg-white dark:bg-bakery-950 transition-colors duration-300">
                    {/* Header Greeting / Title */}
                    <div className="flex items-center gap-4">
                        <h1 className="font-bold text-bakery-900 dark:text-bakery-50 text-lg hidden md:block">Gestión Pastelería</h1>
                        {/* Mobile Spacer if needed involved with menu button z-index? ResponsiveNavigation handles mobile menu button */}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <div className="w-8 h-8 rounded-full bg-bakery-200 dark:bg-bakery-700 flex items-center justify-center font-bold text-bakery-700 dark:text-bakery-200">
                            {user?.username?.charAt(0).toUpperCase() || 'M'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={window.location.pathname}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {content}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Floating Action Button (FAB) */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.location.href = '/folio/nuevo'} // Simple nav for now, preferably use navigate hook if possible but component is simple layout
                    className="absolute bottom-8 right-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-full shadow-lg shadow-pink-500/30 z-50 flex items-center justify-center md:hidden"
                >
                    <Plus size={24} strokeWidth={3} />
                </motion.button>
            </div>
        </div>
    );
};

export default DashboardLayout;
