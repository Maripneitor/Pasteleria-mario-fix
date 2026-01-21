import React, { createContext, useContext, useState, useCallback } from 'react';

const SystemLogContext = createContext();

export const SystemLogProvider = ({ children }) => {
    const [logs, setLogs] = useState([]);
    const [aiStats, setAiStats] = useState({ attempts: 0, successes: 0, failures: 0 });

    const addLog = useCallback((level, message, data = null) => {
        const timestamp = new Date().toISOString();
        const newLog = { id: Date.now(), timestamp, level, message, data };

        setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 100)); // Keep last 100 logs
        console.log(`[SystemLog:${level}]`, message, data);
    }, []);

    const trackAiScan = useCallback((success) => {
        setAiStats(prev => ({
            ...prev,
            attempts: prev.attempts + 1,
            successes: success ? prev.successes + 1 : prev.successes,
            failures: !success ? prev.failures + 1 : prev.failures
        }));
        addLog(
            success ? 'INFO' : 'ERROR',
            `AI Scan ${success ? 'Completed' : 'Failed'}`,
            { timestamp: new Date() }
        );
    }, [addLog]);

    const clearLogs = useCallback(() => setLogs([]), []);

    // Escuchar eventos desde fuera de React (ej. api.js interceptors)
    React.useEffect(() => {
        const handleSystemLog = (event) => {
            const { level, message, data } = event.detail;
            addLog(level, message, data);
        };

        window.addEventListener('system-log-event', handleSystemLog);
        return () => window.removeEventListener('system-log-event', handleSystemLog);
    }, [addLog]);

    return (
        <SystemLogContext.Provider value={{ logs, aiStats, addLog, trackAiScan, clearLogs }}>
            {children}
        </SystemLogContext.Provider>
    );
};

export const useSystemLog = () => {
    const context = useContext(SystemLogContext);
    if (!context) {
        throw new Error('useSystemLog must be used within a SystemLogProvider');
    }
    return context;
};

// Export context for Class Components consumer if needed
export { SystemLogContext };
