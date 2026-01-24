import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSystemLog } from '../context/SystemLogContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Activity, AlertCircle, X, Server } from 'lucide-react';
import api from '../api/axios';

const DevOverlay = () => {
    const { user, debugLogin } = useAuth();
    const { logs } = useSystemLog();
    const [isOpen, setIsOpen] = useState(false);
    const [latency, setLatency] = useState(0);

    // Only show for Developer
    if (!user || user.role !== 'Desarrollador') return null;

    useEffect(() => {
        const checkLatency = async () => {
            const start = Date.now();
            try {
                await api.get('/'); // Simple health check or root
                const end = Date.now();
                setLatency(end - start);
            } catch (e) {
                setLatency(-1);
            }
        };

        const interval = setInterval(checkLatency, 5000);
        checkLatency();
        return () => clearInterval(interval);
    }, []);

    const errors = logs.filter(l => l.level === 'ERROR' || l.level === 'warn').slice(0, 3);

    return (
        <div className="fixed bottom-4 right-4 z-[9999] font-mono text-xs">
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-black/90 text-green-400 p-4 rounded-xl border border-green-800 shadow-2xl w-80 backdrop-blur-md"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2 text-green-300 font-bold uppercase tracking-wider">
                                <Eye size={14} /> Ojo de Dios
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors"><X size={14} /></button>
                        </div>

                        {/* Metrics */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-green-900/20 p-2 rounded">
                                <div className="flex items-center gap-2">
                                    <Activity size={14} />
                                    <span>Memoria (Heap)</span>
                                </div>
                                <span className="text-green-400">
                                    {window.performance?.memory ? `${Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024)} MB` : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-green-900/20 p-2 rounded">
                                <div className="flex items-center gap-2">
                                    <Server size={14} />
                                    <span>API Latency</span>
                                </div>
                                <span className={latency > 200 ? 'text-red-400' : 'text-green-400'}>
                                    {latency >= 0 ? `${latency}ms` : 'OFFLINE'}
                                </span>
                                <span className={latency > 200 ? 'text-red-400' : 'text-green-400'}>
                                    {latency >= 0 ? `${latency}ms` : 'OFFLINE'}
                                </span>
                            </div>

                            {/* AUTH DEBUGGER */}
                            <div className="bg-orange-900/10 p-2 rounded border border-orange-900/30">
                                <div className="text-orange-500 font-bold mb-1 border-b border-orange-900/50 flex justify-between items-center">
                                    <span>AUTH DEBUGGER</span>
                                    <span className="text-[9px] bg-orange-900/50 px-1 rounded">SECURE</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                    <div className="col-span-2">
                                        <span className="text-gray-400">Último Email:</span>
                                        <div className="text-white font-mono truncate">
                                            {sessionStorage.getItem('debug_last_auth_email') || 'N/A'}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-gray-400">Token Status:</span>
                                        <div className={localStorage.getItem('token') && localStorage.getItem('token').split('.').length === 3 ? "text-green-400" : "text-red-500"}>
                                            {localStorage.getItem('token')
                                                ? (localStorage.getItem('token').split('.').length === 3 ? "VALID (FMT)" : "CORRUPT")
                                                : "MISSING"}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-gray-400">Server Last Code:</span>
                                        <div className="text-orange-300 font-bold">
                                            {logs.find(l => l.level === 'ERROR' && l.message.includes('API'))?.data?.status || 'N/A'}
                                        </div>
                                    </div>

                                    <div>Role: <span className="text-white">{user?.role || "N/A"}</span></div>
                                    <div>Status: <span className={user?.status === 'active' ? "text-green-400" : "text-yellow-400"}>{user?.status || "N/A"}</span></div>
                                </div>

                                <button
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('user');
                                        sessionStorage.clear();
                                        delete api.defaults.headers.common['Authorization'];
                                        window.location.href = '/login';
                                    }}
                                    className="mt-2 w-full bg-red-900/80 hover:bg-red-800 text-white py-1 rounded text-[10px] uppercase font-bold transition-colors border border-red-700"
                                >
                                    Limpiar Sesión Forzada
                                </button>

                                {import.meta.env.DEV && !user && (
                                    <button
                                        onClick={() => debugLogin()}
                                        className="mt-1 w-full bg-green-900 hover:bg-green-800 text-green-100 py-1 rounded text-[10px] uppercase font-bold transition-colors"
                                    >
                                        Force Login Dev
                                    </button>
                                )}
                            </div>

                            <div className="bg-green-900/10 p-2 rounded max-h-40 overflow-y-auto">
                                <div className="flex items-center gap-2 text-green-600 mb-2 border-b border-green-900/30 pb-1">
                                    <AlertCircle size={12} />
                                    <span>Últimos Errores (SQL/Sys)</span>
                                </div>
                                {errors.length === 0 ? (
                                    <div className="text-gray-500 italic py-2">Sistema nominal. Sin errores.</div>
                                ) : (
                                    errors.map((log) => (
                                        <div key={log.id} className="mb-2 last:mb-0 border-l-2 border-red-500 pl-2">
                                            <div className="text-white font-bold">{log.message}</div>
                                            <div className="text-gray-400 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="mt-2 text-[10px] text-green-900/50 text-center uppercase tracking-[0.2em]">
                            System Integrity Active
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        layoutId="god-eye-trigger"
                        onClick={() => setIsOpen(true)}
                        className="bg-black text-green-500 p-3 rounded-full shadow-lg border border-green-900/50 hover:bg-green-900/20 transition-all hover:scale-110 group"
                    >
                        <Eye size={20} className="group-hover:animate-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DevOverlay;
