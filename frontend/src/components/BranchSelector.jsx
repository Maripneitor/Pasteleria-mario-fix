import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Store, ChevronDown } from 'lucide-react';

const BranchSelector = () => {
    const { user, currentBranch, switchBranch, availableBranches } = useAuth();

    // Si el usuario solo tiene una sucursal, solo mostramos el nombre
    if (availableBranches.length <= 1) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-bakery-milk font-medium">
                <Store size={18} className="text-bakery-primary" />
                <span>{currentBranch?.name || 'Sucursal Única'}</span>
            </div>
        );
    }

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-bakery-800 border border-gray-200 dark:border-bakery-700 rounded-xl shadow-sm hover:border-bakery-primary transition-all">
                <Store size={18} className="text-bakery-primary" />
                <span className="text-sm font-bold text-gray-700 dark:text-white">
                    {currentBranch?.name || 'Seleccionar Tienda'}
                </span>
                <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 transition-transform" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute top-full mt-2 left-0 w-56 bg-white dark:bg-bakery-800 rounded-2xl shadow-xl border border-gray-100 dark:border-bakery-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
                <p className="px-4 py-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Cambiar de Sucursal</p>
                {availableBranches.map((branch) => (
                    <button
                        key={branch.id}
                        onClick={() => switchBranch(branch.id)}
                        className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-bakery-50 dark:hover:bg-bakery-700 transition-colors ${currentBranch?.id === branch.id ? 'text-bakery-primary font-bold' : 'text-gray-600 dark:text-gray-300'
                            }`}
                    >
                        {branch.name}
                        {currentBranch?.id === branch.id && <div className="w-1.5 h-1.5 rounded-full bg-bakery-primary shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BranchSelector;
