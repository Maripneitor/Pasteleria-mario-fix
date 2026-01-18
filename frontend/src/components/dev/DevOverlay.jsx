import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSystemLog } from '../../context/SystemLogContext';
import { Activity, Database, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const DevOverlay = () => {
    const { user } = useAuth();
    const { logs, aiStats } = useSystemLog();
    const [isVisible, setIsVisible] = useState(false);
    const [metrics, setMetrics] = useState(null);

    // Only for Developers
    if (user?.role !== 'Desarrollador') return null;

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await api.get('/dashboard/developer'); // Using the new endpoint
                setMetrics(res.data);
            } catch (err) {
                console.error("Error fetching dev metrics", err);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000); // 5s refresh
        return () => clearInterval(interval);
    }, []);

    // Last 5 SQL Errors
    const sqlErrors = logs.filter(l => l.level === 'ERROR' && (l.message.includes('SQL') || l.message.includes('Database'))).slice(0, 5);

    return (
        <>
            {/* Toggle Button (Hidden in corner) */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="fixed bottom-2 right-2 z-[9999] opacity-20 hover:opacity-100 transition-opacity bg-black text-white p-1 rounded-full text-xs"
                title="God's Eye"
            >
                <Eye size={12} />
            </button>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="fixed top-4 right-4 z-[9999] w-80 bg-black/90 backdrop-blur-md text-green-400 font-mono text-xs p-4 rounded-lg shadow-2xl border border-green-500/30 pointer-events-auto"
                    >
                        <div className="flex justify-between items-center mb-4 border-b border-green-500/30 pb-2">
                            <h3 className="font-bold uppercase tracking-widest flex items-center gap-2">
                                <Activity size={14} /> Dev Console
                            </h3>
                            <button onClick={() => setIsVisible(false)} className="hover:text-white">
                                <X size={14} />
                            </button>
                        </div>

                        {/* Memory Stats */}
                        <div className="mb-4 space-y-1">
                            <p className="text-gray-400 uppercase text-[10px]">System Memory</p>
                            <div className="flex justify-between">
                                <span>Used Heap:</span>
                                <span className={memory?.used > 500 ? 'text-red-400' : 'text-white'}>{memory?.used || 0} MB</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Limit:</span>
                                <span>{memory?.limit || 0} MB</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1 mt-1 rounded-full overflow-hidden">
                                <div
                                    className="bg-green-500 h-full transition-all duration-500"
                                    style={{ width: `${Math.min(((memory?.used || 0) / (memory?.limit || 1)) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Logs */}
                        <div className="space-y-2">
                            <p className="text-gray-400 uppercase text-[10px] flex items-center gap-2">
                                <Database size={10} /> Last Database Errors
                            </p>
                            {sqlErrors.length === 0 ? (
                                <p className="text-gray-600 italic">No recent SQL errors.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {sqlErrors.map(err => (
                                        <li key={err.id} className="bg-red-900/20 p-2 rounded border-l-2 border-red-500">
                                            <p className="text-red-300 font-bold truncate">{err.message}</p>
                                            <p className="text-gray-500 text-[10px]">{new Date(err.timestamp).toLocaleTimeString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* AI Stats */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-gray-400 uppercase text-[10px] mb-1">AI Diagnostics</p>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-white/5 rounded p-1">
                                    <span className="block text-white font-bold">{aiStats.attempts}</span>
                                    <span className="text-[9px] text-gray-500">Scans</span>
                                </div>
                                <div className="bg-green-900/30 rounded p-1 border border-green-900/50">
                                    <span className="block text-green-400 font-bold">{aiStats.successes}</span>
                                    <span className="text-[9px] text-gray-500">Ok</span>
                                </div>
                                <div className="bg-red-900/30 rounded p-1 border border-red-900/50">
                                    <span className="block text-red-400 font-bold">{aiStats.failures}</span>
                                    <span className="text-[9px] text-gray-500">Fail</span>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DevOverlay;
