import React, { useState, useEffect } from 'react';
import api, { updateUserRole } from '../services/api';
import './AdminUserManagement.css';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterRole, setFilterRole] = useState('All');

    // CSV Export
    const exportToCSV = () => {
        const headers = ["ID", "Usuario", "Email", "Rol", "Estatus", "Dueño"];
        const rows = users.filter(u => filterRole === 'All' || u.role === filterRole).map(u => [
            u.id,
            u.username,
            u.email,
            u.role,
            u.status,
            u.ownerId || 'N/A'
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "usuarios_sistema.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data);

            // Filter potential owners (users with role 'Dueño')
            const potentialOwners = response.data.filter(u => u.role === 'Dueño');
            setOwners(potentialOwners);

            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("No se pudo cargar el registro de usuarios.");
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            // Optimistic update
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));

            await updateUserRole(userId, { role: newRole });

            // Refresh to ensure consistency (especially for owner lists)
            if (newRole === 'Dueño' || newRole === 'Empleado') {
                fetchUsers();
            }
        } catch (err) {
            console.error("Error updating role:", err);
            alert("Error al actualizar el rol.");
            fetchUsers(); // Revert
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
            await updateUserRole(userId, { status: newStatus });
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Error al actualizar el estatus.");
            fetchUsers();
        }
    };

    const handleOwnerChange = async (userId, newOwnerId) => {
        try {
            // Convert to integer or null
            const ownerId = newOwnerId ? parseInt(newOwnerId) : null;

            setUsers(users.map(u => u.id === userId ? { ...u, ownerId: ownerId } : u));
            await updateUserRole(userId, { ownerId: ownerId });
        } catch (err) {
            console.error("Error updating owner:", err);
            alert("Error al vincular dueño.");
            fetchUsers();
        }
    };

    const filteredUsers = users.filter(u => filterRole === 'All' || u.role === filterRole);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-slate-900/50">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Administración de Usuarios</h1>

                    <div className="flex gap-4">
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-white"
                        >
                            <option value="All">Todos los Roles</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Dueño">Dueño</option>
                            <option value="Empleado">Empleado</option>
                            <option value="Desarrollador">Desarrollador</option>
                        </select>

                        <button
                            onClick={exportToCSV}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            Exportar CSV
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Rol</th>
                                <th className="px-6 py-4">Estatus</th>
                                <th className="px-6 py-4">Dueño (Vinculación)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.username}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            className="bg-transparent border border-gray-200 dark:border-slate-600 rounded px-2 py-1 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        >
                                            <option value="Administrador">Administrador</option>
                                            <option value="Dueño">Dueño</option>
                                            <option value="Empleado">Empleado</option>
                                            <option value="Desarrollador">Desarrollador</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            className={`bg-transparent border border-gray-200 dark:border-slate-600 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 font-medium ${user.status === 'banned' ? 'text-red-500' : 'text-green-500'
                                                }`}
                                            value={user.status}
                                            onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                        >
                                            <option value="active">Activo</option>
                                            <option value="pending_verification">Pendiente</option>
                                            <option value="banned">Baneado</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role === 'Empleado' ? (
                                            <select
                                                className="w-full bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded px-2 py-1 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                                                value={user.ownerId || ''}
                                                onChange={(e) => handleOwnerChange(user.id, e.target.value)}
                                            >
                                                <option value="">-- Sin Vincular --</option>
                                                {owners.map(owner => (
                                                    <option key={owner.id} value={owner.id}>
                                                        {owner.username} (ID: {owner.id})
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUserManagement;
