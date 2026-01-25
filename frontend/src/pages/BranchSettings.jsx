import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
// import { User, Settings, Save, Palette, Image as ImageIcon } from 'lucide-react'; // Imports need verification if installed, using basic text if unsure or standard heroicons/lucide-react from App

const BranchSettings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({ logoUrl: '', primaryColor: '#000000', name: '' });
    const [loading, setLoading] = useState(true);

    // Determine Branch ID context (assuming user has branchId, or we use 'current' / 'me' endpoint logic if available)
    // For now, based on previous tasks, we might need to know WHICH branch to edit.
    // If Owner, maybe they edit their main branch? Or we pass ID.
    // Let's assume we edit the branch the user is logged into (user.branchId).

    // Fallback: If no branchId in user context, invalid state.
    const currentBranchId = user?.branchId;

    useEffect(() => {
        if (!currentBranchId) return;
        const fetchData = async () => {
            try {
                const res = await api.get(`/branches/${currentBranchId}`);
                setSettings({
                    logoUrl: res.data.logoUrl || '',
                    primaryColor: res.data.primaryColor || '#000000',
                    name: res.data.name
                });
            } catch (error) {
                console.error("Error loading branch settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentBranchId]);

    const handleSave = async () => {
        try {
            await api.put(`/branches/${currentBranchId}`, settings);
            alert('Personalización guardada exitosamente');
        } catch (error) {
            console.error("Error saving settings", error);
            alert('Error al guardar: ' + (error.response?.data?.message || error.message));
        }
    };

    if (!currentBranchId) return <div className="p-8 text-center text-red-500">Error: No tienes una sucursal asignada.</div>;
    if (loading) return <div className="p-8 text-center text-gray-500">Cargando configuración...</div>;

    return (
        <div className="p-6 bg-white dark:bg-slate-900 min-h-screen">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Personalización de Reportes - {settings.name}</h2>

                <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 space-y-6 border border-gray-200 dark:border-slate-700">

                    {/* Logo Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL del Logo</label>
                        <input
                            value={settings.logoUrl}
                            onChange={e => setSettings({ ...settings, logoUrl: e.target.value })}
                            className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                            placeholder="https://ejemplo.com/mi-logo.png"
                        />
                        <p className="text-xs text-gray-500 mt-1">Ingresa la URL pública de tu logotipo.</p>
                    </div>

                    {/* Color Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color Principal</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                value={settings.primaryColor}
                                onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                                className="h-12 w-24 cursor-pointer border-none bg-transparent"
                            />
                            <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{settings.primaryColor}</span>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="mt-8 border-t dark:border-slate-700 pt-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Vista Previa</h3>
                        <div className="border border-gray-200 rounded-xl p-8 flex flex-col items-center bg-white shadow-sm max-w-sm mx-auto">
                            {settings.logoUrl ? (
                                <img src={settings.logoUrl} alt="Logo Preview" className="h-16 object-contain mb-4" onError={(e) => e.target.style.display = 'none'} />
                            ) : (
                                <div className="h-16 w-32 bg-gray-100 flex items-center justify-center text-xs text-gray-400 mb-4 rounded">Sin Logo</div>
                            )}
                            <h4 style={{ color: settings.primaryColor }} className="text-xl font-bold mb-2">Encabezado de Ejemplo</h4>
                            <div className="w-full h-2 rounded mb-2" style={{ backgroundColor: settings.primaryColor }}></div>
                            <p className="text-xs text-gray-500 text-center">Así se verán los colores de tus reportes PDF.</p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default BranchSettings;
