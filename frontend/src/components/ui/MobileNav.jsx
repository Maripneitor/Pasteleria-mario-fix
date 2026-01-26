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
            <div className="bg-surface/90 backdrop-blur-md border border-border rounded-2xl shadow-lg shadow-primary/5 flex justify-around items-center p-3">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className="relative flex flex-col items-center justify-center w-12 h-12"
                    >
                        {isActive(item.path) && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-primary/10 rounded-xl"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <item.icon
                            size={24}
                            className={`z-10 transition-colors duration-200 ${isActive(item.path) ? 'text-primary' : 'text-text-muted'}`}
                        />
                    </button>
                ))}

                <button
                    onClick={onLogout}
                    className="flex flex-col items-center justify-center w-12 h-12 text-text-muted hover:text-status-danger transition-colors"
                >
                    <LogOut size={24} />
                </button>
            </div>
        </div>
    );
};

export default MobileNav;
