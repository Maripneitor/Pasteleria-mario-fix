import React, { useEffect, useRef } from 'react';
import { useSystemLog } from '../context/SystemLogContext';
import { Terminal, Trash2, Activity, Play, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const DevDashboard = () => {
    const { logs, aiStats, addLog, clearLogs } = useSystemLog();
    const logContainerRef = useRef(null);

    // Auto-scroll to bottom of logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const handlePanic = () => {
        if (window.confirm('⚠️ PANIC: ¿Estás seguro de resetear toda la aplicación? Esto borrará el caché y reiniciará.')) {
            addLog('CRITICAL', 'PANIC BUTTON PRESSED');
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
        }
    };

    const getLogColor = (level) => {
        switch (level) {
            case 'ERROR': return 'text-red-500';
            case 'WARN': return 'text-yellow-500';
            case 'CRITICAL': return 'text-red-600 font-bold animate-pulse';
            case 'INFO': default: return 'text-green-500';
        }
    };

    return (
        <div className="h-full bg-stone-900 p-4 md:p-8 font-mono min-h-screen text-green-500 overflow-hidden flex flex-col gap-6">

            {/* Header */}
            <header className="flex justify-between items-center border-b-2 border-stone-700 pb-4">
                <div className="flex items-center gap-3">
                    <Terminal size={32} className="text-green-500" />
                    <h1 className="text-2xl font-bold tracking-wider text-green-500">DEV_COMMAND_CENTER_v1.0</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs text-stone-500">
                        STATUS: <span className="text-green-400">ONLINE</span>
                    </div>
                </div>
            </header>

            {/* Dashboard Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">

                {/* Left Col: Logs (Terminal) */}
                <div className="lg:col-span-2 flex flex-col bg-black border-4 border-stone-800 rounded-lg shadow-2xl overflow-hidden relative">
                    <div className="bg-stone-800 px-4 py-2 flex justify-between items-center text-xs font-bold text-stone-300">
                        <span>SYSTEM LOGS</span>
                        <div className="flex gap-2">
                            <button onClick={clearLogs} className="hover:text-white flex items-center gap-1 hover:underline">
                                <Trash2 size={12} /> CLEAR
                            </button>
                        </div>
                    </div>
                    <div
                        ref={logContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm"
                        style={{ fontFamily: '"Fira Code", monospace' }}
                    >
                        {logs.length === 0 && <span className="text-stone-600 italic">// Waiting for system events...</span>}
                        {logs.slice().reverse().map((log) => (
                            <div key={log.id} className="flex gap-2 break-all hover:bg-white/5 p-0.5 rounded">
                                <span className="text-stone-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                <span className={`font-bold shrink-0 w-16 ${getLogColor(log.level)}`}>{log.level}</span>
                                <span className="text-stone-300">{log.message}</span>
                                {log.data && (
                                    <span className="text-stone-600 text-xs truncate max-w-xs">{JSON.stringify(log.data)}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Scanlines Effect Overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-20"></div>
                </div>

                {/* Right Col: Stats & Tools */}
                <div className="flex flex-col gap-6">

                    {/* AI Health Monitor */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-stone-900 border-2 border-green-900 p-4 rounded-lg relative overflow-hidden"
                    >
                        <h3 className="flex items-center gap-2 text-lg font-bold text-green-600 mb-4 border-b border-green-900/50 pb-2">
                            <Activity size={20} /> AI HEALTH MONITOR
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span>ATTEMPTS:</span>
                                <span className="text-xl font-bold">{aiStats.attempts}</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span>SUCCESS RATE</span>
                                    <span>{aiStats.attempts > 0 ? Math.round((aiStats.successes / aiStats.attempts) * 100) : 100}%</span>
                                </div>
                                <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-500"
                                        style={{ width: `${aiStats.attempts > 0 ? (aiStats.successes / aiStats.attempts) * 100 : 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-center text-xs">
                                <div className="bg-green-900/20 py-2 rounded border border-green-900/30">
                                    <span className="block text-green-400 font-bold text-lg">{aiStats.successes}</span>
                                    OK
                                </div>
                                <div className="bg-red-900/20 py-2 rounded border border-red-900/30">
                                    <span className="block text-red-500 font-bold text-lg">{aiStats.failures}</span>
                                    FAIL
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Simulation Tools */}
                    <div className="bg-stone-900 border-2 border-stone-800 p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-stone-500 mb-3">TOOLS & SIMULATION</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => addLog('INFO', 'Test Log Generated')}
                                className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-xs rounded border border-stone-600 transition-colors"
                            >
                                LOG TEST
                            </button>
                            <button
                                onClick={() => addLog('ERROR', 'Simulated Error', { error: 'Test Error' })}
                                className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-xs rounded border border-stone-600 text-yellow-500 transition-colors"
                            >
                                ERR TEST
                            </button>
                        </div>
                    </div>

                    {/* Panic Button */}
                    <div className="mt-auto">
                        <button
                            onClick={handlePanic}
                            className="w-full group relative overflow-hidden bg-red-900/20 hover:bg-red-900/40 border-2 border-red-600 text-red-500 p-4 rounded-lg font-bold tracking-widest transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <AlertTriangle className="animate-pulse" /> PANIC: RESET SYSTEM
                            </span>
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xIDFoMnYySDFWMXoiIGZpbGw9InJnYmEoMjU1LCAwLCAwLCAwLjEpIi8+PC9zdmc+')] opacity-50"></div>
                        </button>
                        <p className="text-[10px] text-center text-stone-600 mt-2">
                            * Force clears localStorage & reloads. Use with caution.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DevDashboard;
