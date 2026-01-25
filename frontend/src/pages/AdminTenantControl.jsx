import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Building, ArrowRightLeft } from 'lucide-react';

const AdminTenantControl = () => {
    const [users, setUsers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [u, b] = await Promise.all([api.get('/users'), api.get('/branches')]);
                setUsers(u.data);
                setBranches(b.data);
            } catch (error) {
                console.error("Error loading admin data", error);
                alert("Error cargando datos de usuarios/sucursales");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleMoveUser = async (userId, newBranchId) => {
        try {
            // Using endpoint to update user branch association
            // Assuming simplified update on user-role or membership logic
            // If backend has specific move endpoint, use it. 
            // Based on user request "PUT /users/:id/move"

            // Check if endpoint exists, or use generic update
            await api.put(`/users/${userId}/move`, { branchId: newBranchId });

            alert('Usuario movido exitosamente');
            // Optimistic update or reload
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, branchId: newBranchId } : u
            ));
        } catch (e) {
            console.error(e);
            alert('Error al mover usuario: ' + (e.response?.data?.message || e.message));
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando panel de administración...</div>;

    return (
        <div className="p-6 bg-white dark:bg-slate-900 min-h-screen">
            <div className="mb-6 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <ArrowRightLeft size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Multi-Tenant</h1>
                    <p className="text-sm text-gray-500">Reasignación de empleados entre sucursales</p>
                </div>
            </div>

            <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200 dark:border-slate-800">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-800 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Usuario</th>
                            <th className="px-6 py-3">Rol</th>
                            <th className="px-6 py-3">Sucursal Actual</th>
                            <th className="px-6 py-3">Mover a Sucursal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b dark:bg-slate-900 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold">{user.username}</div>
                                        <div className="text-xs text-gray-400">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}
                                    `}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {branches.find(b => b.id == user.branchId)?.name || 'Sin Asignar (Global)'}
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                                        value={user.branchId || ''}
                                        onChange={(e) => handleMoveUser(user.id, e.target.value)}
                                        disabled={user.role === 'admin' || user.role === 'developer'} // Prevent moving superusers easily? Or allow it. User requested admin interface.
                                    >
                                        <option value="" disabled>Seleccionar Sucursal</option>
                                        {branches.map(branch => (
                                            <option Key={branch.id} value={branch.id}>
                                                {branch.name} {branch.isMain ? '(Matriz)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTenantControl;
