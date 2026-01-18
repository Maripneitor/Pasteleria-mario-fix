import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Lock, ShieldCheck, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Import real auth context if we want real API calls

const RegisterOwnerModal = ({ isOpen, onClose, onUserAdded }) => {
    // In a real app we would use the AuthContext register function
    // const { register } = useAuth();

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Dueño' // Default
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Password validation logic
    const isPasswordStrong = (pwd) => pwd.length >= 6; // Simplified for demo
    const passwordsMatch = formData.password === formData.confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!passwordsMatch) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (!isPasswordStrong(formData.password)) {
            setError('La contraseña es muy débil (mínimo 6 caracteres).');
            return;
        }

        // Mock API Call simulation
        setSuccess(true);
        setTimeout(() => {
            if (onUserAdded) onUserAdded({ ...formData, password: 'HASHED_SECRET' }); // Don't pass real password up
            setSuccess(false);
            setFormData({ username: '', email: '', password: '', confirmPassword: '', role: 'Dueño' });
            onClose();
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-bakery-chocolate p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold flex items-center gap-2">
                                <ShieldCheck size={20} className="text-bakery-accent" />
                                Alta de Usuario Seguro
                            </h3>
                            <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Success State */}
                        {success ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail size={32} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">¡Registro Iniciado!</h4>
                                <p className="text-gray-500">
                                    El usuario ha sido creado en estado <span className="font-mono bg-yellow-100 text-yellow-800 px-1 rounded">pending_verification</span>.
                                    <br />Revise la bandeja de entrada simulada.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {error && (
                                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                                        <AlertCircle size={16} /> {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rol de Acceso</label>
                                    <select
                                        className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 font-medium text-gray-700 focus:ring-2 focus:ring-bakery-accent outline-none"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="Dueño">Dueño (Owner)</option>
                                        <option value="Empleado">Empleado (Staff)</option>
                                        <option value="Administrador">Administrador (Root)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Usuario</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 pl-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bakery-accent outline-none"
                                        placeholder="Nombre de usuario"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Corporativo</label>
                                    <input
                                        type="email"
                                        className="w-full p-2 pl-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bakery-accent outline-none"
                                        placeholder="staff@pasteleria.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contraseña</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                className="w-full p-2 pl-8 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bakery-accent outline-none"
                                                placeholder="••••••"
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                required
                                            />
                                            <Lock size={14} className="absolute left-2.5 top-3 text-gray-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirmar</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                className={`w-full p-2 pl-8 rounded-lg border focus:ring-2 outline-none ${passwordsMatch && formData.confirmPassword ? 'border-green-300 focus:ring-green-400 bg-green-50' : 'border-gray-200 focus:ring-bakery-accent'}`}
                                                placeholder="••••••"
                                                value={formData.confirmPassword}
                                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                required
                                            />
                                            <Lock size={14} className="absolute left-2.5 top-3 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 mt-2 bg-bakery-accent hover:bg-yellow-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <UserPlus size={18} />
                                    Registrar Usuario
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RegisterOwnerModal;
