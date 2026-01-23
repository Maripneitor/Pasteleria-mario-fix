export interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

export interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

export interface SystemLogEntry {
    id: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
    message: string;
    timestamp: Date;
    data?: Record<string, unknown>;
}

export interface SystemLogContextType {
    logs: SystemLogEntry[];
    addLog: (level: SystemLogEntry['level'], message: string, data?: Record<string, unknown>) => void;
    clearLogs: () => void;
}
