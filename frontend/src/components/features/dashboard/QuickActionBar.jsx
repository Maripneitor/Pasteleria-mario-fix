import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, BarChart2, PlusCircle, Settings, Shield } from 'lucide-react';

const QuickActionBar = ({ role }) => {
    const navigate = useNavigate();

    // Define actions per role
    const actions = {
        'Administrador': [
            { label: 'Gestionar Dueños', icon: Users, path: '/dashboard/owner', color: 'bg-purple-100 text-purple-600' },
            { label: 'Logs del Sistema', icon: Shield, path: '/system-health', color: 'bg-gray-100 text-gray-600' },
            { label: 'Estadísticas Globales', icon: BarChart2, path: '/estadisticas', color: 'bg-blue-100 text-blue-600' },
        ],
        'Dueño': [
            { label: 'Registrar Empleado', icon: PlusCircle, path: '/register', color: 'bg-green-100 text-green-600' },
            { label: 'Ver Ventas', icon: BarChart2, path: '/estadisticas', color: 'bg-emerald-100 text-emerald-600' },
            { label: 'Configuración', icon: Settings, path: '/dashboard/owner', color: 'bg-amber-100 text-amber-600' },
        ],
        // Fallback for others (can be empty)
        'Vendedor': [
            { label: 'Nuevo Pedido', icon: PlusCircle, path: '/folio/nuevo', color: 'bg-red-100 text-red-600' },
        ]
    };

    const currentActions = actions[role] || [];

    if (currentActions.length === 0) return null;

    return (
        <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex space-x-4 min-w-max px-1">
                {currentActions.map((action, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(action.path)}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-bakery-dark-surface shadow-sm border border-gray-100 dark:border-gray-700 min-w-[7rem] h-28 gap-2 transition-colors"
                    >
                        <div className={`p-3 rounded-xl ${action.color} bg-opacity-20 dark:bg-opacity-10`}>
                            <action.icon size={24} className={action.color.split(' ')[1]} />
                        </div>
                        <span className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 leading-tight">
                            {action.label}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default QuickActionBar;
