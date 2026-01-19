import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Send, Sparkles, ArrowRight, Loader } from 'lucide-react';

const AiInbox = () => {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [extractedData, setExtractedData] = useState(null);

    const handleAnalyze = async () => {
        if (!inputText.trim()) return;
        setLoading(true);
        try {
            const response = await api.post('/ai/extract-folio', { text: inputText });
            setExtractedData(response.data);
        } catch (error) {
            console.error("AI Error:", error);
            alert("Error al procesar el texto.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFolio = () => {
        if (!extractedData) return;
        // Navegar a Nuevo Folio pasando el state
        navigate('/folio/nuevo', { state: { prefilledData: extractedData } });
    };

    return (
        <div className="p-6 max-w-6xl mx-auto h-screen flex flex-col md:flex-row gap-6">

            {/* INPUT AREA */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm p-6">
                <h1 className="text-2xl font-serif font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles className="text-purple-500" />
                    Bandeja de IA
                </h1>
                <p className="text-sm text-gray-500 mb-4">Pega un pedido de WhatsApp o escribe los detalles aquí.</p>

                <textarea
                    className="flex-1 w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none resize-none font-mono text-sm"
                    placeholder="Ej: Pastel de Chocolate para 20 personas para Ana el viernes..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !inputText.trim()}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium disabled:opacity-50 transition-all"
                    >
                        {loading ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
                        {loading ? "Procesando..." : "Analizar con IA"}
                    </button>
                </div>
            </div>

            {/* PREVIEW AREA */}
            <div className="flex-1 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-6 flex flex-col justify-center items-center relative overflow-hidden">

                {extractedData ? (
                    <div className="w-full max-w-sm bg-white shadow-xl rounded-xl p-6 border border-purple-100 relative z-10 animate-in fade-in zoom-in duration-300">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-t-xl" />

                        <h3 className="font-bold text-gray-800 text-lg mb-4">Borrador Detectado</h3>

                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex justify-between border-b pb-2">
                                <span>Cliente:</span>
                                <span className="font-medium text-gray-900">{extractedData.clientName}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Personas:</span>
                                <span className="font-medium text-gray-900">{extractedData.persons}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Sabor:</span>
                                <span className="font-medium text-gray-900">{extractedData.cakeFlavor}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Fecha:</span>
                                <span className="font-medium text-gray-900">{extractedData.deliveryDate}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCreateFolio}
                            className="mt-6 w-full bg-bakery-primary hover:bg-bakery-accent text-white py-3 rounded-lg font-bold shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition-transform hover:scale-105"
                        >
                            Confirmar y Crear <ArrowRight size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles size={24} className="text-gray-300" />
                        </div>
                        <p>Los resultados aparecerán aquí</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiInbox;
