import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Sparkles, ArrowLeft, Save, Bot, User } from 'lucide-react';
import api from '../api/axios';
import FolioForm from '../components/FolioForm';
import { useToast } from '../context/ToastSystem';
import ErrorState from '../components/common/ErrorState';
import Skeleton from '../components/common/Skeleton';

const SessionConsole = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError, showAiActive } = useToast();

    const [session, setSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Add error state
    const [processing, setProcessing] = useState(false);

    // Extract data for the form
    const [previewData, setPreviewData] = useState(null);

    const messagesEndRef = useRef(null);

    const fetchSession = async () => {
        try {
            setError(null);
            const res = await api.get(`/ai-sessions/${id}`);
            setSession(res.data);
            setMessages(res.data.chatHistory || []);
            setPreviewData(res.data.extractedData || {});
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError("No se pudo cargar la sesión");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSession();
        // Optional: Polling for new WhatsApp messages while in console
        const interval = setInterval(fetchSession, 10000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || processing) return;

        const userMsg = input;
        setInput('');
        setProcessing(true);
        // Optimistic UI
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

        try {
            showAiActive("Procesando tu solicitud...");
            const res = await api.post(`/ai-sessions/${id}/chat`, { message: userMsg });

            // The AI might return tool calls or just text. 
            // The backend updates the session DB, so we re-fetch to get the latest extractedData and history
            await fetchSession();
        } catch (error) {
            showError("Error al comunicar con la IA");
        } finally {
            setProcessing(false);
        }
    };

    const handleFinalize = async () => {
        // Trigger generic "generate folio" command or save manually
        if (window.confirm("¿Confirmar y generar folio final?")) {
            try {
                // We can use the FolioForm's submit, OR send a special valid command to AI
                await api.post(`/ai-sessions/${id}/chat`, { message: "Generar Folio Final y confirmar pedido." });
                await fetchSession();
                showSuccess("Instrucción enviada. Generando...");
                // Wait a bit and redirect
                setTimeout(() => navigate('/folios'), 2000);
            } catch (error) {
                showError("Error al finalizar");
            }
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center p-8">
            <div className="max-w-md w-full space-y-4">
                <Skeleton variant="text" height="40px" width="60%" className="mx-auto" />
                <Skeleton variant="rect" height="300px" className="rounded-xl" />
            </div>
        </div>
    );

    if (error) return (
        <div className="h-screen flex items-center justify-center">
            <ErrorState
                message={error}
                onRetry={() => {
                    setLoading(true);
                    fetchSession();
                }}
            />
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-gray-100 dark:bg-slate-900 overflow-hidden">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/asistente-ia')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                            <Sparkles className="text-purple-500" size={18} />
                            Consola Inteligente
                        </h1>
                        <p className="text-xs text-gray-500">Sesión: {id.slice(0, 8)}...</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleFinalize}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-green-500/20"
                    >
                        <Save size={18} /> Confirmar Pedido
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Chat */}
                <div className="w-1/3 min-w-[320px] bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                                    }`}>
                                    <div className="flex items-center gap-1 mb-1 opacity-70 text-xs">
                                        {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                                        <span>{msg.role === 'user' ? 'Tú' : 'AI'}</span>
                                    </div>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900">
                        <div className="flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={processing}
                                placeholder={processing ? "La IA está pensando..." : "Escribe una instrucción..."}
                                className="flex-1 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={processing || !input.trim()}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right: Preview (FolioForm in Read/Check Mode) */}
                <div className="flex-1 bg-gray-50 dark:bg-slate-950 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-2 z-10">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded border border-yellow-200">
                            Vista Previa en Vivo
                        </span>
                    </div>
                    {/* We reuse the powerful FolioForm, initializing it with the extracted data */}
                    {/* Key property key={JSON.stringify(previewData)} forces re-render when AI updates data */}
                    <div className="h-full overflow-y-auto p-4 scale-95 origin-top">
                        <FolioForm
                            key={JSON.stringify(previewData)}
                            initialData={previewData}
                            onCancel={() => { }}
                            onSuccess={() => { }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionConsole;
