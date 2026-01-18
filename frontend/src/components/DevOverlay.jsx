import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSystemLog } from '../context/SystemLogContext';
import { Terminal, X, Activity, Database, AlertCircle } from 'lucide-react';

const DevOverlay = () => {
    const { user } = useAuth();
    const { logs } = useSystemLog();
    const [isOpen, setIsOpen] = useState(false);
    const [stats, setStats] = useState({
        memory: 0,
        fps: 0
    });

    // Only render for Developer role
    // Assuming role string is strictly 'Desarrollador' based on request, 
    // or we might check for 'admin' if that is the tech role. 
    // I'll stick to 'Desarrollador' as requested.
    if (!user || user.role !== 'Desarrollador') return null;

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();

        const updateStats = () => {
            const now = performance.now();
            frameCount++;

            if (now - lastTime >= 1000) {
                setStats(prev => ({
                    ...prev,
                    fps: frameCount
                }));
                frameCount = 0;
                lastTime = now;
            }

            if (performance.memory) {
                setStats(prev => ({
                    ...prev,
                    memory: Math.round(performance.memory.usedJSHeapSize / 1048576)
                }));
            }

            requestAnimationFrame(updateStats);
        };

        const animationId = requestAnimationFrame(updateStats);
        return () => cancelAnimationFrame(animationId);
    }, []);

    // Filter "ERROR" logs from the system log context
    // We want specifically those captured by GlobalErrorBoundary or critical system errors
    const recentErrors = logs.filter(log =>
        (log.level === 'ERROR' || log.level === 'error')
    ).slice(0, 3); // Limit to last 3

    const displayLogs = recentErrors.length > 0 ? recentErrors : [];

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 left-4 z-50 bg-black/80 text-green-400 p-3 rounded-full shadow-lg border border-green-900 hover:scale-110 transition-transform font-mono text-xs flex items-center gap-2 group"
                title="Ojo de Dios"
            >
                <Terminal size={18} />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">Dev Console</span>
            </button>
        );
    }

    // Adjusted styling for responsiveness:
    // Mobile: Top-Right (less obtrusive than bottom-left which might overlap with fab/nav)
    // Desktop: Bottom-Left
    return (
        <div className="fixed top-4 right-4 md:top-auto md:right-auto md:bottom-4 md:left-4 z-[9999] w-72 md:w-80 bg-black/95 text-green-400 font-mono text-xs rounded-lg shadow-2xl border border-green-900 overflow-hidden backdrop-blur-sm transition-all">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-green-900 bg-green-900/10">
                <div className="flex items-center gap-2 font-bold">
                    <Activity size={14} />
                    <span>OJO DE DIOS</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">
                    <X size={14} />
                </button>
            </div>

            {/* Performance Stats */}
            <div className="p-3 grid grid-cols-2 gap-2 border-b border-green-900/50">
                <div className="flex flex-col gap-1">
                    <span className="text-gray-500">MEM HEAP</span>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${Math.min((stats.memory / 200) * 100, 100)}%` }} // Assuming 200MB baseline scale
                        />
                    </div>
                    <span className="text-right">{stats.memory} MB</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-gray-500">FPS</span>
                    <span className="text-xl font-bold text-white">{stats.fps}</span>
                </div>
            </div>

            {/* SQL Errors */}
            <div className="p-3">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                    <Database size={12} />
                    <span>LATEST SYSTEM ERRORS</span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {displayLogs.length === 0 ? (
                        <div className="text-gray-600 italic py-2 text-center border border-dashed border-gray-800 rounded">
                            No captured SQL errors
                        </div>
                    ) : (
                        displayLogs.map((log, i) => (
                            <div key={i} className="bg-red-900/10 border border-red-900/30 p-2 rounded text-red-300">
                                <div className="flex items-center gap-1 mb-1 font-bold text-[10px] text-red-500">
                                    <AlertCircle size={10} />
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </div>
                                <div className="break-all">
                                    {log.message}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Command Input Placeholder */}
            <div className="bg-black p-2 border-t border-green-900 flex gap-2">
                <span className="text-green-600">{'>'}</span>
                <input
                    type="text"
                    placeholder="Execute system call..."
                    className="bg-transparent border-none outline-none text-white w-full placeholder-green-900"
                    disabled
                />
            </div>
        </div>
    );
};

export default DevOverlay;
