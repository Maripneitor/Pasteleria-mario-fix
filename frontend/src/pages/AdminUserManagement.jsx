import React, { useState, useEffect } from 'react';
import api, { updateUserRole } from '../services/api';
import './AdminUserManagement.css';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div className="rustic-container"><div className="rustic-book">Cargando Registro...</div></div>;
    if (error) return <div className="rustic-container"><div className="rustic-book">{error}</div></div>;

    return (
        <div className="rustic-container">
            <div className="rustic-book">
                <h1 className="rustic-title">Libro de Registro de Usuarios</h1>

                <table className="rustic-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estatus</th>
                            <th>Dueño (Vinculación)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className={user.status === 'banned' ? 'row-banned' : ''}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        className="rustic-select"
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    >
                                        <option value="Administrador">Administrador</option>
                                        <option value="Dueño">Dueño</option>
                                        <option value="Empleado">Empleado</option>
                                        <option value="Desarrollador">Desarrollador</option>
                                    </select>
                                </td>
                                <td>
                                    <select
                                        className="rustic-select"
                                        value={user.status}
                                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                        style={{ color: user.status === 'banned' ? '#c62828' : '#2e7d32' }}
                                    >
                                        <option value="active">Activo</option>
                                        <option value="pending_verification">Pendiente</option>
                                        <option value="banned">Baneado</option>
                                    </select>
                                </td>
                                <td>
                                    {user.role === 'Empleado' ? (
                                        <select
                                            className="rustic-select owner-select"
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
                                        <span style={{ color: '#aaa', fontStyle: 'italic' }}>N/A</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserManagement;
