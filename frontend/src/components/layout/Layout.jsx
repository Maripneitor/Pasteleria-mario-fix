import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, MessageSquare, ClipboardList, PlusCircle, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ResponsiveNavigation from './ResponsiveNavigation';

const Layout = () => {
    const { user, logout } = useAuth(); // Keep useAuth for potential future use or if ResponsiveNavigation needs it via props
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-bakery-dark-bg transition-colors duration-300 dark:shadow-[inset_0_0_100px_rgba(230,81,0,0.15)]">
            {/* Unified Navigation */}
            <ResponsiveNavigation />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-64">
                {/* Header Spacer for Mobile only */}
                <div className="h-16 lg:hidden" />

                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Layout;
