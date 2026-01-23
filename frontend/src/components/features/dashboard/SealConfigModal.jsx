import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const SealConfigModal = ({ isOpen, onClose }) => {
    const { user, token } = useAuth();
    const [sealUrl, setSealUrl] = useState(user?.ownerSeal || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Update user profile with the new seal URL
            await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`,
                { ownerSeal: sealUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Optionally update local user context or trigger a reload/toast
            // For now just close
            onClose();
            alert('Sello actualizado. Se verá reflejado en los próximos folios.'); // Simple feedback
        } catch (error) {
            console.error(error);
            alert('Error al guardar el sello.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                    >
                        <div className="bg-bakery-chocolate p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold">Configurar Sello Digital</h3>
                            <button onClick={onClose}><X size={20} /></button>
                        </div>

                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-500">
                                Ingrese la URL de su imagen (logo o sello) en formato PNG con fondo transparente.
                                Aparecerá automáticamente en la esquina de sus folios PDF.
                            </p>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">URL de la Imagen</label>
                                <input
                                    type="text"
                                    value={sealUrl}
                                    onChange={(e) => setSealUrl(e.target.value)}
                                    placeholder="https://ejemplo.com/mi-sello.png"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-bakery-accent outline-none"
                                />
                            </div>

                            <div className="border rounded-lg p-4 bg-gray-50 flex flex-col items-center justify-center min-h-[150px]">
                                {sealUrl ? (
                                    <img src={sealUrl} alt="Vista previa" className="max-h-32 object-contain" onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                    <span className="text-gray-400 text-sm">Vista previa</span>
                                )}
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full py-3 bg-bakery-primary text-white font-bold rounded-lg hover:bg-bakery-chocolate transition-colors flex justify-center items-center gap-2"
                            >
                                {isSaving ? 'Guardando...' : <><Check size={18} /> Guardar Sello</>}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SealConfigModal;
