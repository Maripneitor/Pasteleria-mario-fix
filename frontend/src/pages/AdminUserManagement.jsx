import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Shield, Briefcase, Mail, Loader2, Trash2 } from 'lucide-react';
import BakeryButton from '../components/ui/BakeryButton';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError('Error al cargar usuarios.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert('Error al eliminar usuario');
        }
    };

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-bakery-primary" size={48} />
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-800 dark:text-white">Gestión de Usuarios</h1>
                    <p className="text-gray-500 dark:text-gray-400">Administra el acceso del personal y dueños.</p>
                </div>
                {/* <BakeryButton variant="solid" onClick={() => {}}>Nuevo Usuario</BakeryButton> */}
            </header>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-2">
                    <Shield size={20} /> {error}
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-bakery-50 dark:bg-slate-800 text-xs uppercase font-bold text-bakery-accent tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Rol</th>
                            <th className="px-6 py-4">Sucursal (Tenant)</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-bakery-secondary flex items-center justify-center text-bakery-accent font-bold">
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="font-medium text-gray-900 dark:text-gray-200">{user.username}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} /> {user.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1
                                        ${user.role === 'Administrador' || user.role === 'developer' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'Dueño' ? 'bg-amber-100 text-amber-700' :
                                                'bg-blue-100 text-blue-700'}`}>
                                        <Briefcase size={12} /> {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm">
                                    {user.tenant_id ? `Tenant ${user.tenant_id}` : (user.ownerId ? `Owner ${user.ownerId}` : '-')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Eliminar Usuario"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-400 italic">
                                    No se encontraron usuarios.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
