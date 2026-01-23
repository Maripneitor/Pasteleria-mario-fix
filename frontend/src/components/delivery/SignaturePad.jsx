import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser, Check, X } from 'lucide-react';

const SignaturePad = ({ onSave, onCancel }) => {
    const padRef = useRef(null);
    const [isEmpty, setIsEmpty] = useState(true);

    const handleClear = () => {
        padRef.current.clear();
        setIsEmpty(true);
    };

    const handleSave = () => {
        if (isEmpty) return;
        const dataUrl = padRef.current.getTrimmedCanvas().toDataURL('image/png');
        onSave(dataUrl);
    };

    const handleBegin = () => {
        setIsEmpty(false);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="bg-gray-50 dark:bg-slate-700/50 p-3 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Firma del Cliente</span>
                <button
                    onClick={handleClear}
                    className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                    title="Borrar firma"
                >
                    <Eraser size={14} /> Borrar
                </button>
            </div>

            <div className="bg-white cursor-crosshair relative">
                <SignatureCanvas
                    ref={padRef}
                    penColor="black"
                    backgroundColor="rgba(255,255,255,1)"
                    canvasProps={{
                        className: 'w-full h-48 block',
                        width: 500, // Ideally responsive, but canvas needs explicit dims
                        height: 200
                    }}
                    onBegin={handleBegin}
                />
                {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-gray-300 text-lg font-handwriting italic opacity-50">Firme aquí</span>
                    </div>
                )}
            </div>

            <div className="p-3 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-2">
                <button
                    onClick={onCancel}
                    className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-slate-600 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSave}
                    disabled={isEmpty}
                    className={`
                        px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-all
                        ${isEmpty
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-bakery-primary text-white hover:bg-bakery-accent shadow-md'}
                    `}
                >
                    <Check size={16} /> Confirmar
                </button>
            </div>
        </div>
    );
};

export default SignaturePad;
