import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle, Clipboard } from 'lucide-react';
import aiService from '../../services/aiService';
import AnimatedInput from '../ui/AnimatedInput';

const AiInbox = ({ onOrderCreated }) => {
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedData, setExtractedData] = useState(null);

    const handleExtract = async () => {
        if (!inputText.trim()) return;

        setIsProcessing(true);
        try {
            const data = await aiService.extractOrderDetails(inputText);
            setExtractedData(data);
        } catch (error) {
            console.error(error);
            // Handle error toast
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirm = () => {
        if (onOrderCreated) {
            onOrderCreated(extractedData);
        }
        // Reset or show success state
        setInputText('');
        setExtractedData(null);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                    <Sparkles size={18} />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-800 dark:text-white">
                    Recepción Inteligente
                </h3>
            </div>

            <p className="text-gray-500 text-sm mb-6">
                Pega el mensaje de WhatsApp del cliente abajo. La IA extraerá los detalles automáticamente.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Area */}
                <div className="space-y-4">
                    <div className="relative">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ej: Hola, quiero un pastel de Chocolate para el sábado a las 4pm. Soy María, mi número es 555-1234."
                            className="w-full h-48 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-bakery-primary/50 focus:border-bakery-primary transition-all resize-none text-gray-700 dark:text-gray-200"
                        />
                        <button
                            onClick={() => navigator.clipboard.readText().then(t => setInputText(t))}
                            className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-700 rounded-lg text-gray-400 hover:text-bakery-primary shadow-sm border border-gray-100 dark:border-slate-600 transition-colors"
                            title="Pegar del portapapeles"
                        >
                            <Clipboard size={16} />
                        </button>
                    </div>

                    <button
                        onClick={handleExtract}
                        disabled={isProcessing || !inputText}
                        className={`
                            w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                            ${isProcessing
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-bakery-primary text-white hover:bg-bakery-accent shadow-lg shadow-bakery-primary/30 hover:scale-[1.02]'}
                        `}
                    >
                        {isProcessing ? (
                            <>Procesando...</>
                        ) : (
                            <>
                                <Sparkles size={18} /> Extraer Detalles
                            </>
                        )}
                    </button>
                </div>

                {/* Result Area */}
                <div className="relative">
                    <AnimatePresence>
                        {extractedData ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-bakery-50 dark:bg-bakery-900/30 rounded-xl p-6 border border-bakery-100 dark:border-bakery-800 h-full flex flex-col"
                            >
                                <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                    <CheckCircle size={18} className="text-green-500" />
                                    Borrador Detectado
                                </h4>

                                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                                            <span className="text-xs text-gray-400 block">Cliente</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{extractedData.clientName}</span>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                                            <span className="text-xs text-gray-400 block">Fecha</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{extractedData.deliveryDate}</span>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                                            <span className="text-xs text-gray-400 block">Sabor</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{extractedData.cakeFlavor}</span>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                                            <span className="text-xs text-gray-400 block">Relleno</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{extractedData.filling}</span>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                                        <span className="text-xs text-gray-400 block">Descripción Original</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic">"{inputText}"</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfirm}
                                    className="w-full mt-4 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    Crear Pedido <ArrowRight size={18} />
                                </button>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl p-8 text-center">
                                <Sparkles size={48} className="mb-4 text-gray-200 dark:text-slate-700" />
                                <p>Los detalles extraídos aparecerán aquí para tu revisión.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AiInbox;
