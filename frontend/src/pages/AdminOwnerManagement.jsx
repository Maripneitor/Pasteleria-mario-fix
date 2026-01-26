import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Search, Sliders, Mail } from 'lucide-react';
// import api from '../services/api'; // In real implementation
import RegisterOwnerModal from '../components/admin/RegisterOwnerModal';

// MOCK DATA for Demo
const MOCK_OWNERS = [
    { id: 101, username: 'Pastelería Centro', email: 'contacto@centro.com', status: 'active', employeeCount: 4, permissions: { canUseAI: true, canViewStats: true } },
    { id: 102, username: 'Sucursal Norte', email: 'gerencia@norte.com', status: 'pending_verification', employeeCount: 0, permissions: { canUseAI: false, canViewStats: false } },
    { id: 103, username: 'Mario Lozano', email: 'marioL@gmail.com', status: 'active', employeeCount: 12, permissions: { canUseAI: true, canViewStats: true, canManageUsers: true } },
];

import { useToast } from '../context/ToastSystem';

const AdminOwnerManagement = () => {
    const { showSuccess } = useToast();
    const [owners, setOwners] = useState(MOCK_OWNERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredOwners = owners.filter(o =>
        o.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleActivate = (id) => {
        setOwners(owners.map(o => o.id === id ? { ...o, status: 'active' } : o));
        showSuccess('Dueño activado correctamente.');
        // api.put(`/users/${id}/activate`)
    };

    const handleTogglePermission = (id, perm) => {
        setOwners(owners.map(o =>
            o.id === id
                ? { ...o, permissions: { ...o.permissions, [perm]: !o.permissions[perm] } }
                : o
        ));
    };

    const handleOwnerAdded = (u) => {
        setOwners([...owners, { ...u, id: Date.now(), status: 'pending_verification', permissions: { canUseAI: false }, employeeCount: 0 }]);
        showSuccess('Dueño registrado correctamente.');
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 md:ml-20">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <Shield className="text-bakery-accent" size={32} />
                            Gestión de Dueños
                        </h1>
                        <p className="text-gray-500 mt-1">Administración centralizada de franquicias y dueños.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-bakery-chocolate text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition shadow-lg flex items-center gap-2"
                    >
                        + Registrar Nuevo Dueño
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <Search className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        className="flex-1 outline-none text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Buscar dueños"
                    />
                </div>

                {/* Owners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredOwners.map((owner) => (
                        <motion.div
                            layout
                            key={owner.id}
                            className={`bg-white rounded-2xl p-6 border-2 transition-all ${owner.status === 'active' ? 'border-transparent shadow-sm' : 'border-bakery-accent/30 bg-bakery-cream/10'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{owner.username}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Mail size={12} /> {owner.email}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${owner.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {owner.status === 'active' ? 'Activo' : 'Pendiente'}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
                                    <span className="text-gray-500">Empleados</span>
                                    <span className="font-bold text-gray-800">{owner.employeeCount}</span>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Permisos</p>
                                    <div className="flex gap-2">
                                        <PermissionToggle
                                            active={owner.permissions.canUseAI}
                                            label="AI Inbox"
                                            onClick={() => handleTogglePermission(owner.id, 'canUseAI')}
                                        />
                                        <PermissionToggle
                                            active={owner.permissions.canViewStats}
                                            label="Stats"
                                            onClick={() => handleTogglePermission(owner.id, 'canViewStats')}
                                        />
                                    </div>
                                </div>

                                {owner.status === 'pending_verification' && (
                                    <button
                                        onClick={() => handleActivate(owner.id)}
                                        className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition shadow-md flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={16} /> Activar Cuenta
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <RegisterOwnerModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onUserAdded={handleOwnerAdded}
                />
            </div>
        </div>
    );
};

const PermissionToggle = ({ active, label, onClick }) => (
    <button
        onClick={onClick}
        aria-pressed={active}
        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition border ${active ? 'bg-bakery-primary text-white border-bakery-primary' : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'}`}
    >
        {label}
    </button>
);

export default AdminOwnerManagement;
