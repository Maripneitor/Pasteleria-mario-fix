import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useSystemLog } from '../context/SystemLogContext';

// Wrapper to inject context into Class Component
const AppErrorBoundaryWithLog = (props) => {
    // Try-catch block for hook usage in case it's used outside provider (though unlikely in App)
    try {
        const { addLog } = useSystemLog();
        return <AppErrorBoundary {...props} logError={addLog} />;
    } catch (e) {
        // Fallback if no provider
        return <AppErrorBoundary {...props} logError={console.error} />;
    }
};

class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log to SystemLog
        if (this.props.logError) {
            this.props.logError('ERROR', 'AppErrorBoundary Caught Error', { error: error.toString(), info: errorInfo });
        }
        console.error("🔥 [AppErrorBoundary] caught an error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full rounded-xl shadow-xl border-2 border-amber-100 overflow-hidden text-center p-8">
                        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={32} className="text-red-500" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">
                            ¡Ups! Algo inesperado ocurrió.
                        </h2>

                        <p className="text-gray-600 mb-8">
                            Nuestros panaderos digitales tuvieron un pequeño problema. No te preocupes, intenta recargar la página.
                        </p>

                        <button
                            onClick={this.handleReset}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <RefreshCw size={18} />
                            Recargar Aplicación
                        </button>

                        {/* Developer Info */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-8 text-left bg-gray-100 p-4 rounded text-xs font-mono text-red-600 overflow-x-auto">
                                <strong>Error Details:</strong>
                                <br />
                                {this.state.error.toString()}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AppErrorBoundaryWithLog;
