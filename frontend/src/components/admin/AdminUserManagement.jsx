import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Assuming we use react-query now
import { Shield, UserCheck, UserX, Lock, Unlock, Mail, Plus } from 'lucide-react';
import RegisterOwnerModal from './RegisterOwnerModal';
// Note: In real implementation, replace with actual API calls
// For now, we mock the API interactions

const MOCK_USERS = [
    { id: 1, username: 'MarioDueño', role: 'Dueño', status: 'active', email: 'mario@pasteleria.com', permissions: { canUseAI: true, canViewStats: true } },
    { id: 2, username: 'JuanEmpleado', role: 'Empleado', status: 'pending_verification', email: 'juan@demo.com', permissions: { canUseAI: false, canViewStats: false } },
    { id: 3, username: 'AdminSys', role: 'Administrador', status: 'active', email: 'admin@sys.com', permissions: { canUseAI: true, canViewStats: true, canManageUsers: true } },
];

const AdminUserManagement = () => {
    const [users, setUsers] = useState(MOCK_USERS); // Local state for mock demo
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const toggleStatus = (userId) => {
        setUsers(users.map(u =>
            u.id === userId
                ? { ...u, status: u.status === 'active' ? 'banned' : 'active' }
                : u
        ));
    };

    const togglePermission = (userId, perm) => {
        setUsers(users.map(u =>
            u.id === userId
                ? { ...u, permissions: { ...u.permissions, [perm]: !u.permissions[perm] } }
                : u
        ));
    };

    // Determine status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><UserCheck size={12} /> Activo</span>;
            case 'pending_verification': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Mail size={12} /> Pendiente</span>;
            case 'banned': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><UserX size={12} /> Bloqueado</span>;
            default: return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Shield className="text-bakery-accent" />
                    Panel de Permisos y Usuarios
                </h2>
                <button
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="bg-bakery-chocolate text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-opacity-90 transition flex items-center gap-2"
                >
                    <Plus size={16} /> Nuevo Usuario
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                            <th className="p-3">Usuario</th>
                            <th className="p-3">Rol</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3 text-center">IA Access</th>
                            <th className="p-3 text-center">Ver Stats</th>
                            <th className="p-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                <td className="p-3 font-medium text-gray-700">
                                    {user.username}
                                    <div className="text-xs text-gray-400 font-normal">{user.email}</div>
                                </td>
                                <td className="p-3">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{user.role}</span>
                                </td>
                                <td className="p-3">
                                    {getStatusBadge(user.status)}
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => togglePermission(user.id, 'canUseAI')}
                                        className={`p-1 rounded transition ${user.permissions?.canUseAI ? 'text-green-500 bg-green-50' : 'text-gray-300 hover:bg-gray-100'}`}
                                    >
                                        <Lock size={16} className={user.permissions?.canUseAI ? "hidden" : "block"} />
                                        <Unlock size={16} className={user.permissions?.canUseAI ? "block" : "hidden"} />
                                    </button>
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => togglePermission(user.id, 'canViewStats')}
                                        className={`p-1 rounded transition ${user.permissions?.canViewStats ? 'text-blue-500 bg-blue-50' : 'text-gray-300 hover:bg-gray-100'}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${user.permissions?.canViewStats ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                    </button>
                                </td>
                                <td className="p-3 text-right">
                                    {user.status === 'pending_verification' && (
                                        <button
                                            onClick={() => toggleStatus(user.id)}
                                            className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2"
                                        >
                                            Activar
                                        </button>
                                    )}
                                    <button
                                        onClick={() => toggleStatus(user.id)}
                                        className="text-gray-400 hover:text-red-500"
                                        title={user.status === 'active' ? 'Bloquear' : 'Desbloquear'}
                                    >
                                        <UserX size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <RegisterOwnerModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                onUserAdded={(newUser) => setUsers([...users, { ...newUser, id: Date.now(), status: 'pending_verification', permissions: {} }])} // Mock add
            />
        </div>
    );
};

export default AdminUserManagement;
