import React from 'react';
import { Home, ShoppingBag, Plus, Search, Trello, BarChart2, Package, Users, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DesktopSidebar = ({ onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="hidden md:flex flex-col items-center py-8 bg-surface dark:bg-surface-card border-r border-border dark:border-white/5 h-full w-20 shadow-sm dark:shadow-xl fixed top-0 left-0 z-50 transition-colors duration-300">
            {/* Brand Logo - Semantic */}
            <div className="mb-10 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-primary/30 shadow-lg">
                P
            </div>

            <div className="flex-1 flex flex-col gap-6 w-full items-center">
                <NavIcon
                    Icon={Home}
                    active={isActive('/dashboard')}
                    onClick={() => navigate('/dashboard')}
                    tooltip="Home"
                />
                <NavIcon
                    Icon={ShoppingBag}
                    active={isActive('/folios')}
                    onClick={() => navigate('/folios')}
                    tooltip="Pedidos"
                />
                <NavIcon
                    Icon={Trello}
                    active={location.pathname === '/produccion'}
                    onClick={() => navigate('/produccion')}
                    tooltip="Producción"
                />

                <div className="w-8 h-px bg-gray-200 dark:bg-slate-700 my-2 mx-auto"></div>

                <NavIcon
                    Icon={BarChart2}
                    active={location.pathname === '/estadisticas'}
                    onClick={() => navigate('/estadisticas')}
                    tooltip="Estadísticas"
                />
                {/* Inventory Hidden for Clients
                 <NavIcon
                    Icon={Package}
                    active={location.pathname === '/inventario'}
                    onClick={() => navigate('/inventario')}
                    tooltip="Inventario"
                /> 
                */}
                <NavIcon
                    Icon={Users}
                    active={location.pathname === '/clientes'}
                    onClick={() => navigate('/clientes')}
                    tooltip="Clientes"
                />
                <NavIcon
                    Icon={Search}
                    active={isActive('/calendario')}
                    onClick={() => navigate('/calendario')}
                    tooltip="Buscar"
                />
            </div>

            <div className="mt-auto">
                <NavIcon
                    Icon={LogOut}
                    active={false}
                    onClick={onLogout}
                    danger
                    tooltip="Salir"
                />
            </div>
        </div>
    );
};

const NavIcon = ({ Icon, active, onClick, danger, tooltip }) => (
    <div className="group relative flex items-center justify-center">
        <button
            onClick={onClick}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${active
                ? 'bg-primary/10 text-primary shadow-inner'
                : danger
                    ? 'text-text-secondary hover:text-status-danger hover:bg-status-danger/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-muted'
                }`}
        >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
        </button>
        {/* Tooltip */}
        <span className="absolute left-full ml-4 px-2 py-1 bg-surface-muted text-text-primary border border-border text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
            {tooltip}
        </span>
    </div>
);

export default DesktopSidebar;
