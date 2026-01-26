import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import BakeryButton from '../ui/BakeryButton';

const ROLES = [
    { value: 'Empleado', label: 'Empleado' },
    { value: 'Dueño', label: 'Dueño' },
    { value: 'Administrador', label: 'Administrador' },
];

import FocusTrap from '../ui/FocusTrap';

const CreateUserModal = ({ isOpen, onClose, onCreateUser }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: 'Empleado',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.email) {
            setError('Todos los campos son obligatorios');
            return;
        }

        setIsLoading(true);
        try {
            await onCreateUser(formData);
            onClose();
            setFormData({ username: '', email: '', role: 'Empleado' }); // Reset form
        } catch (err) {
            setError('Error al crear usuario. Intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-md"
                    >
                        <FocusTrap isActive={isOpen}>
                            <Card glass className="p-6 relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
                                    aria-label="Cerrar modal"
                                >
                                    <X size={20} />
                                </button>

                                <h2 id="modal-title" className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                                    <User className="text-brand-primary" size={24} />
                                    Nuevo Usuario
                                </h2>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2" role="alert">
                                        <AlertCircle size={16} />
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="username">
                                            Nombre de Usuario
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                id="username"
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border dark:border-white/10 bg-white dark:bg-surface-card text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                                                placeholder="Ej. JuanPerez"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                                            Correo Electrónico
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border dark:border-white/10 bg-white dark:bg-surface-card text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                                                placeholder="juan@ejemplo.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="role">
                                            Rol
                                        </label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <select
                                                id="role"
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border dark:border-white/10 bg-white dark:bg-surface-card text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all appearance-none"
                                            >
                                                {ROLES.map(role => (
                                                    <option key={role.value} value={role.value}>{role.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end gap-3">
                                        <BakeryButton variant="ghost" onClick={onClose} type="button">
                                            Cancelar
                                        </BakeryButton>
                                        <BakeryButton variant="solid" type="submit" isLoading={isLoading}>
                                            Crear Usuario
                                        </BakeryButton>
                                    </div>
                                </form>
                            </Card>
                        </FocusTrap>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreateUserModal;
