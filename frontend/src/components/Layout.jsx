import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, MessageSquare, ClipboardList, PlusCircle, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Administrador'] },
        { name: 'Calendario', href: '/calendario', icon: Calendar, roles: ['Administrador', 'Vendedor', 'Pastelero'] },
        { name: 'Bandeja IA', href: '/bandeja-ia', icon: MessageSquare, roles: ['Administrador', 'Vendedor'] },
        { name: 'Folios', href: '/folios', icon: ClipboardList, roles: ['Administrador', 'Vendedor', 'Pastelero'] },
        { name: 'Nuevo Folio', href: '/folio/nuevo', icon: PlusCircle, roles: ['Administrador', 'Vendedor'] },
    ];

    const isActive = (path) => location.pathname === path;

    // Filter items based on role
    const filteredNav = navigation.filter(item =>
        !item.roles || (user && item.roles.includes(user.role))
    );

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
                <div className="p-6 flex items-center gap-3">
                    {/* Red-500 for Brand as requested */}
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                        P
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight">Pastelería</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4">
                    {filteredNav.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive(item.href)
                                    ? 'bg-orange-50 text-orange-600' // Orange for active/inbox feel
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.username || 'Usuario'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.role || 'Rol'}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Overlay */}
            <div className={`fixed inset-0 bg-black/50 z-40 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} onClick={() => setIsMobileMenuOpen(false)} />

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-200 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">P</div>
                        <span className="text-xl font-bold text-gray-800">Pastelería</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500"><X size={24} /></button>
                </div>
                <nav className="px-4 space-y-2">
                    {filteredNav.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive(item.href) ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-white shadow-sm h-16 flex items-center justify-between px-4 z-30">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600"><Menu size={24} /></button>
                    <span className="font-bold text-gray-800">Pastelería</span>
                    <div className="w-8" /> {/* Spacer */}
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
