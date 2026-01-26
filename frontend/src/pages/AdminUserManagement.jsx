import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { Search, Plus, User, Mail, Shield, Trash2, Edit, RefreshCw, MoreVertical } from 'lucide-react';
import BakeryButton from '../components/ui/BakeryButton';
import CreateUserModal from '../components/admin/CreateUserModal';
import { motion } from 'framer-motion';

const AdminUserManagement = () => {
    const { users, isLoading, error, createUser, deleteUser } = useUsers();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Filter Logic
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'Administrador': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
            case 'Dueño': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
            case 'Empleado': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            case 'pending': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
            case 'inactive': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (error) return (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">
            {error}
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                        Gestión de Usuarios
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Administra el acceso y roles del personal de la pastelería.
                    </p>
                </div>
                <BakeryButton onClick={() => setIsCreateModalOpen(true)} icon={Plus}>
                    Crear Usuario
                </BakeryButton>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-surface-card rounded-xl p-4 shadow-sm border border-border dark:border-white/5 flex items-center gap-3">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre, correo o rol..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-surface-card rounded-xl shadow-sm border border-border dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4">Rol</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex justify-center mb-2">
                                            <div className="animate-spin h-6 w-6 border-2 border-brand-primary border-t-transparent rounded-full"></div>
                                        </div>
                                        Cargando usuarios...
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-lg">
                                                    {user.avatar || user.username.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {user.username}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <Mail size={12} /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${getRoleBadgeColor(user.role)}`}>
                                                <Shield size={12} /> {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${getStatusBadgeColor(user.status)}`}>
                                                {user.status === 'active' ? 'Activo' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Editar">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors" title="Reset Password">
                                                    <RefreshCw size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 italic">
                                        No se encontraron usuarios que coincidan con "{searchTerm}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateUser={createUser}
            />
        </div>
    );
};

export default AdminUserManagement;
