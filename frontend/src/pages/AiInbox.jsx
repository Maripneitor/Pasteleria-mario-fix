import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, ArrowRight, Trash2, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastSystem';

const AiInbox = () => {
    const navigate = useNavigate();
    const { showError, showSuccess } = useToast();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        try {
            const res = await api.get('/ai-sessions');
            setSessions(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching sessions", error);
            // showError("Error al conectar con el asistente"); 
            setLoading(false);
        }
    };

    // Polling every 30s
    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleDiscard = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("¿Descartar esta conversación?")) {
            try {
                await api.delete(`/ai-sessions/${id}`);
                setSessions(prev => prev.filter(s => s.id !== id));
                showSuccess("Conversación descartada");
            } catch (error) {
                showError("No se pudo descartar la sesión");
            }
        }
    };

    return (
        <div className="space-y-6">
            <header className="mb-6">
                <h1 className="text-2xl font-serif font-bold text-gray-800 dark:text-white">Asistente IA</h1>
                <p className="text-gray-500 dark:text-gray-400">Procesa pedidos desde WhatsApp automáticamente.</p>
            </header>

            {loading ? (
                <div className="text-center p-10"><RefreshCw className="animate-spin mx-auto text-gray-400" /></div>
            ) : sessions.length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-lg dark:bg-slate-800">
                    <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No hay mensajes recientes.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {sessions.map(session => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 flex justify-between items-center cursor-pointer hover:border-blue-300 transition-colors"
                            onClick={() => navigate(`/folios/new?aiSession=${session.id}`)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200">
                                        {session.clientName || 'Cliente Nuevo'}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate max-w-md">
                                        {session.lastMessage || 'Iniciando pedido...'}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                        {new Date(session.updatedAt || Date.now()).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => handleDiscard(session.id, e)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Descartar"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <ArrowRight className="text-gray-300" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AiInbox;
