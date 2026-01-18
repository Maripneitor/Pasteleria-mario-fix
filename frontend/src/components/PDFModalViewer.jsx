import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react';
import api from '../services/api';

const PDFModalViewer = ({ isOpen, onClose, folio, onPrev, onNext, hasPrev, hasNext }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && folio) {
            setLoading(true);
            // Construct PDF URL
            // Assuming backend serves PDF at /api/folios/:id/pdf
            // We use a blob URL to handle auth headers if needed, or direct URL if public/cookie based.
            // For now, let's try direct URL with the proxy.
            const url = `/api/folios/${folio.id}/pdf`;
            setPdfUrl(url);
            setLoading(false);
        }
    }, [isOpen, folio]);

    if (!isOpen || !folio) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Content */}
            <div className="bg-white w-full h-full md:w-[90vw] md:h-[90vh] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">

                {/* Header */}
                <div className="bg-gray-900 text-white p-4 flex justify-between items-center shrink-0">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <span>Folio #{folio.folioNumber || folio.id}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${folio.status === 'Entregado' ? 'bg-green-500' : 'bg-blue-500'}`}>
                                {folio.status}
                            </span>
                        </h3>
                        <p className="text-sm text-gray-400">
                            {folio.clientName} • {new Date(folio.deliveryDate).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href={pdfUrl}
                            download={`Folio_${folio.id}.pdf`}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
                            title="Descargar"
                        >
                            <Download size={20} />
                        </a>
                        <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
                            title="Abrir en nueva pestaña"
                        >
                            <ExternalLink size={20} />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-500 rounded-full transition-colors text-gray-300 hover:text-white ml-2"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Toolbar / Navigation */}
                <div className="bg-gray-100 border-b p-2 flex justify-between items-center">
                    <button
                        onClick={onPrev}
                        disabled={!hasPrev}
                        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700 shadow-sm"
                    >
                        <ChevronLeft size={16} />
                        <span>Anterior</span>
                    </button>

                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest hidden md:block">
                        Visor de Pedidos
                    </span>

                    <button
                        onClick={onNext}
                        disabled={!hasNext}
                        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700 shadow-sm"
                    >
                        <span>Siguiente</span>
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* PDF Viewer Area */}
                <div className="flex-1 bg-gray-500 relative">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                            Cargando documento...
                        </div>
                    )}
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full border-none"
                        title="PDF Viewer"
                    />
                </div>
            </div>
        </div>
    );
};

export default PDFModalViewer;
