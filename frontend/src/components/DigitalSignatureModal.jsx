import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eraser, Check } from 'lucide-react';

const DigitalSignatureModal = ({ isOpen, onClose, onSave }) => {
    const sigCanvas = useRef({});
    const [isEmpty, setIsEmpty] = useState(true);

    const clear = () => {
        sigCanvas.current.clear();
        setIsEmpty(true);
    };

    const save = () => {
        if (isEmpty) return;
        const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        onSave(dataURL);
    };

    const handleBegin = () => {
        setIsEmpty(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-serif font-bold text-bakery-text text-lg">Firma de Recibido</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Canvas Container */}
                        <div className="p-4 bg-white flex-grow flex flex-col items-center">
                            <p className="text-sm text-gray-500 mb-2">Por favor, firme en el recuadro abajo.</p>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden w-full h-64 bg-gray-50 relative touch-none">
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    penColor="black"
                                    canvasProps={{ className: 'w-full h-full signature-canvas' }}
                                    onBegin={handleBegin}
                                />
                                {isEmpty && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-300 opacity-50 select-none">
                                        Firme aquí
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                            <button
                                onClick={clear}
                                className="flex-1 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
                            >
                                <Eraser size={18} />
                                Borrar
                            </button>
                            <button
                                onClick={save}
                                disabled={isEmpty}
                                className={`flex-1 px-4 py-2 text-white rounded-xl transition-colors flex items-center justify-center gap-2 font-bold shadow-lg
                  ${isEmpty
                                        ? 'bg-gray-300 cursor-not-allowed shadow-none'
                                        : 'bg-bakery-primary hover:bg-bakery-accent shadow-bakery-primary/30'}`}
                            >
                                <Check size={18} />
                                Confirmar
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DigitalSignatureModal;
