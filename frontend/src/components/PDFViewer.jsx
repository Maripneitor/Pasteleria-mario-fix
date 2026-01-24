import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FileText, Loader } from 'lucide-react';

const PDFViewer = ({ endpoint, title }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPDF = async () => {
            try {
                setLoading(true);
                setError(null);

                // Si ya tenemos una URL directa, la usamos
                // (útil si el componente padre ya hizo el fetch)
                // if (propUrl) { setPdfUrl(propUrl); return; } 

                // Intentamos obtener el PDF
                // Primero intentamos como JSON esperando { url: '...' }
                const response = await api.get(endpoint);

                if (response.headers['content-type'].includes('application/json')) {
                    if (response.data.url) {
                        setPdfUrl(response.data.url);
                    } else {
                        throw new Error("La respuesta no contiene una URL válida.");
                    }
                } else {
                    // Fallback: Si devuelve blob directo (legacy)
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    const url = window.URL.createObjectURL(blob);
                    setPdfUrl(url);
                }

            } catch (err) {
                console.error("Error cargando PDF", err);
                // Si el error es de axios y tenemos respuesta json error
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("No se pudo cargar el documento.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (endpoint) {
            fetchPDF();
        }

        // Cleanup (solo si creamos blob local, pero aqui simplificamos)
        return () => { };
    }, [endpoint]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg animate-pulse">
                <Loader className="w-8 h-8 text-blue-500 animate-spin mr-2" />
                <span className="text-gray-500 font-medium">Generando visualización...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                <FileText className="w-6 h-6 mr-2" />
                {error}
            </div>
        );
    }

    return (
        <div className="border rounded-lg shadow-lg overflow-hidden h-[600px] bg-white">
            <div className="bg-gray-800 text-white p-2 px-4 flex justify-between items-center">
                <h3 className="font-semibold">{title || 'Visor de Documentos'}</h3>
                <a
                    href={pdfUrl}
                    download={`documento-${Date.now()}.pdf`}
                    className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
                >
                    Descargar
                </a>
            </div>
            <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="PDF Viewer"
            />
        </div>
    );
};

export default PDFViewer;
