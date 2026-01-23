import React from 'react';
import { Home, ShoppingBag, Search, LogOut, Trello } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MobileNav = ({ onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: Home, path: '/dashboard', label: 'Home' },
        { icon: ShoppingBag, path: '/folios', label: 'Pedidos' },
        { icon: Trello, path: '/produccion', label: 'Prod' },
        { icon: Search, path: '/calendario', label: 'Buscar' }, // Mapping 'Buscar' to Calendar/Search logic
    ];

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
            <div className="bg-white/80 backdrop-blur-md border border-red-100 rounded-2xl shadow-lg shadow-red-500/10 flex justify-around items-center p-3">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className="relative flex flex-col items-center justify-center w-12 h-12"
                    >
                        {isActive(item.path) && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-red-100/50 rounded-xl"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <item.icon
                            size={24}
                            className={`z-10 transition-colors duration-200 ${isActive(item.path) ? 'text-red-500' : 'text-gray-400'}`}
                        />
                    </button>
                ))}

                <button
                    onClick={onLogout}
                    className="flex flex-col items-center justify-center w-12 h-12 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <LogOut size={24} />
                </button>
            </div>
        </div>
    );
};

export default MobileNav;
