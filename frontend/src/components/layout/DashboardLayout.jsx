import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import * as Heroes from '@heroicons/react/24/outline';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    // If children are provided, use them. Otherwise, use Outlet.
    const content = children || <Outlet />;

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: 'Squares2X2Icon' },
        { name: 'Pedidos', href: '/folios', icon: 'ShoppingBagIcon' },
        { name: 'Producción', href: '/produccion', icon: 'CakeIcon' },
        { name: 'Clientes', href: '/clientes', icon: 'UsersIcon' },
        { name: 'Finanzas', href: '/estadisticas', icon: 'BanknotesIcon' },
    ];

    const IconWrapper = ({ icon, className }) => {
        const Icon = Heroes[icon];
        return Icon ? <Icon className={className} /> : null;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full z-30 transition-all duration-300 ease-in-out hidden md:flex flex-col`}
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                    {sidebarOpen ? (
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Pastelería Mario</span>
                    ) : (
                        <span className="text-xl font-bold text-indigo-600">PM</span>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200'
                                    }`}
                            >
                                <IconWrapper icon={item.icon} className="w-6 h-6 flex-shrink-0" />
                                <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                    >
                        {sidebarOpen ? <Heroes.ChevronDoubleLeftIcon className="w-5 h-5" /> : <Heroes.ChevronDoubleRightIcon className="w-5 h-5" />}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay (Simplified for now) */}

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                {/* Navbar */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button - to be implemented fully */}
                        <button className="md:hidden p-2 text-gray-500">
                            <Heroes.Bars3Icon className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Panel de Control</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Dark Mode Toggle Placeholder */}
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                            <Heroes.MoonIcon className="w-5 h-5" />
                        </button>
                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
                                <p className="text-xs text-gray-500">Administrador</p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {content}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
