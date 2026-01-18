import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Settings, ToggleLeft, ToggleRight, RefreshCw, Lock } from 'lucide-react';
import api from '../services/api';
import Navigation from '../components/Navigation';

const AdminGlobalAnalytics = () => {
    const [salesData, setSalesData] = useState([]);
    const [owners, setOwners] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [salesRes, ownersRes, logsRes] = await Promise.all([
                api.get('/admin/analytics/sales'),
                api.get('/admin/tenants'),
                api.get('/admin/logs')
            ]);
            setSalesData(salesRes.data);
            setOwners(ownersRes.data);
            setLogs(logsRes.data);
        } catch (error) {
            console.error("Error fetching admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    const toggleFeature = async (ownerId, feature, currentValue) => {
        try {
            const updatedFeatures = { [feature]: !currentValue };
            await api.put(`/admin/tenants/${ownerId}/features`, { features: updatedFeatures });

            // Optimistic update
            setOwners(prev => prev.map(o => {
                if (o.id === ownerId) {
                    const currentConfig = o.dashboardConfig || {};
                    const currentFeatures = currentConfig.features || {};
                    return {
                        ...o,
                        dashboardConfig: {
                            ...currentConfig,
                            features: { ...currentFeatures, ...updatedFeatures }
                        }
                    };
                }
                return o;
            }));
        } catch (error) {
            alert("Error actualizando funcionalidad");
        }
    };

    return (
        <div className="min-h-screen bg-bakery-cream font-sans flex text-gray-800">
            <Navigation />

            <main className="flex-1 w-full max-w-7xl px-8 py-10 md:ml-20">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-bakery-text">Visión Global</h1>
                        <p className="text-gray-500">Métricas de rendimiento y seguridad.</p>
                    </div>
                    <button onClick={fetchData} className="p-2 bg-white rounded-full hover:bg-gray-50 shadow-sm border border-gray-200">
                        <RefreshCw size={20} className={loading ? "animate-spin text-bakery-accent" : "text-gray-400"} />
                    </button>
                </header>

                {/* --- SECCIÓN 1: INTELIGENCIA DE VENTAS (Tiza / Pizarra) --- */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="text-bakery-text" />
                        <h2 className="text-xl font-serif font-bold text-bakery-text">Rendimiento por Sucursal</h2>
                    </div>

                    <div className="bg-[#2A1A10] p-6 rounded-2xl shadow-xl border-4 border-[#3E2723] relative overflow-hidden">
                        {/* Chalk Texture Overlay */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-chalk.png")' }}></div>

                        <div className="relative z-10 h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#8D6E63" opacity={0.3} vertical={false} />
                                    <XAxis dataKey="name" stroke="#FDF8F1" tick={{ fill: '#FDF8F1', fontFamily: 'Inter' }} />
                                    <YAxis stroke="#FDF8F1" tick={{ fill: '#FDF8F1' }} />
                                    <Tooltip
                                        cursor={{ fill: '#3E2723', opacity: 0.4 }}
                                        contentStyle={{ backgroundColor: '#2A1A10', borderColor: '#D4A373', color: '#FDF8F1' }}
                                    />
                                    <Bar dataKey="ventas" radius={[6, 6, 0, 0]} animationDuration={1500}>
                                        {salesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#D4A373' : '#CCD5AE'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* --- SECCIÓN 2: CONTROL DE FUNCIONALIDADES --- */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Settings className="text-bakery-text" />
                            <h2 className="text-xl font-serif font-bold text-bakery-text">Panel de Control de Dueños</h2>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                            {owners.map(owner => {
                                const features = owner.dashboardConfig?.features || {};
                                return (
                                    <div key={owner.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div>
                                            <div className="font-bold text-gray-800">{owner.username}</div>
                                            <div className="text-xs text-gray-400">{owner.email}</div>
                                        </div>
                                        <div className="flex gap-4">
                                            {/* Toggle Vela */}
                                            <button
                                                onClick={() => toggleFeature(owner.id, 'enableTorch', features.enableTorch)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${features.enableTorch ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-gray-50 border-gray-200 text-gray-400 grayscale'}`}
                                            >
                                                <span className="text-xs font-medium">Vela</span>
                                                {features.enableTorch ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                            </button>

                                            {/* Toggle QR */}
                                            <button
                                                onClick={() => toggleFeature(owner.id, 'enableQR', features.enableQR)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${features.enableQR ? 'bg-bakery-cream border-bakery-accent text-bakery-primary' : 'bg-gray-50 border-gray-200 text-gray-400 grayscale'}`}
                                            >
                                                <span className="text-xs font-medium">QR</span>
                                                {features.enableQR ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* --- SECCIÓN 3: LOGS DE SEGURIDAD (Pergamino Técnico) --- */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="text-bakery-text" />
                            <h2 className="text-xl font-serif font-bold text-bakery-text">Bitácora de Seguridad</h2>
                        </div>
                        <div className="bg-[#FEFAE0] p-1 rounded-2xl shadow-lg border border-[#D4A373] relative overflow-hidden h-[400px] flex flex-col">
                            {/* Paper Texture */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

                            <div className="bg-[#F5F5DC] border-b border-[#D4A373] p-2 text-xs font-mono text-[#8D6E63] flex justify-between uppercase tracking-widest relative z-10">
                                <span>/var/log/pasteleria/security.log</span>
                                <Lock size={12} />
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 relative z-10">
                                {logs.map((log, idx) => (
                                    <div key={log.id || idx} className="border-b border-[#D4A373]/20 pb-1 mb-1 last:border-0">
                                        <span className="text-[#8D6E63] mr-2">[{new Date(log.createdAt).toLocaleTimeString()}]</span>
                                        <span className={`font-bold mr-2 uppercase ${log.level === 'error' || log.level === 'security' ? 'text-red-600' :
                                                log.level === 'warn' ? 'text-orange-600' : 'text-blue-600'
                                            }`}>
                                            {log.level}
                                        </span>
                                        <span className="text-[#3E2723]">{log.message}</span>
                                        {/* IP or Meta Preview */}
                                        {log.meta && (
                                            <div className="pl-4 mt-0.5 text-[10px] text-gray-500 truncate">
                                                {JSON.stringify(log.meta)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {logs.length === 0 && <div className="text-center text-gray-400 italic mt-10">Sin eventos recientes.</div>}
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
};

export default AdminGlobalAnalytics;
