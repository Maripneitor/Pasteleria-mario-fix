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

            <AiInboxComponent onOrderCreated={handleOrderCreated} />
        </div>
    );
};

export default AiInbox;
