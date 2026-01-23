import React, { useEffect, useState } from 'react';
import api from '../services/api';
import PDFViewer from './PDFViewer';
import FolioForm from './FolioForm'; // New Component
import { FileText, Plus, Search, Calendar, User, ArrowLeft } from 'lucide-react';

const FolioManager = () => {
    const [folios, setFolios] = useState([]);
    const [filteredFolios, setFilteredFolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFolioId, setSelectedFolioId] = useState(null);
    const [isCreating, setIsCreating] = useState(false); // State for Create Mode

    useEffect(() => {
        fetchFolios();
    }, []);

    useEffect(() => {
        const lower = searchTerm.toLowerCase();
        setFilteredFolios(folios.filter(f =>
            f.folioNumber?.toLowerCase().includes(lower) ||
            f.client?.name?.toLowerCase().includes(lower)
        ));
    }, [searchTerm, folios]);

    const fetchFolios = async () => {
        try {
            setLoading(true);
            const res = await api.get('/folios');
            setFolios(res.data);
            setFilteredFolios(res.data);
        } catch (error) {
            console.error("Error fetching folios", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSuccess = () => {
        setIsCreating(false);
        fetchFolios();
        // Optionally select the new folio if returned
    };

    const handleNewFolioClick = () => {
        setSelectedFolioId(null);
        setIsCreating(true);
    };

    const handleFolioSelect = (id) => {
        setIsCreating(false);
        setSelectedFolioId(id);
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-bakery-cream">
            {/* Sidebar List (Hidden on mobile if creating or viewing?) - For now kept simple */}
            <div className={`${isCreating ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 bg-white border-r border-bakery-highlight flex-col z-10`}>
                <div className="p-4 border-b border-bakery-highlight bg-bakery-cream">
                    <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2 text-bakery-text">
                        <FileText className="text-bakery-accent" /> Pedidos
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-bakery-muted" />
                        <input
                            type="text"
                            placeholder="Buscar folio o cliente..."
                            className="w-full pl-9 pr-3 py-2 border border-bakery-highlight rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-bakery-accent"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-white">
                    {loading ? (
                        <div className="p-4 text-center text-bakery-muted">Cargando...</div>
                    ) : (
                        filteredFolios.map(folio => (
                            <div
                                key={folio.id}
                                onClick={() => handleFolioSelect(folio.id)}
                                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-bakery-highlight/20
                                    ${selectedFolioId === folio.id ? 'bg-bakery-highlight/50 border-l-4 border-l-bakery-accent' : ''}
                                `}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-bakery-text">#{folio.folioNumber}</span>
                                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${folio.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {folio.isPaid ? 'Pagado' : 'Pendiente'}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                                    <User className="h-3 w-3" /> {folio.client?.name || 'Cliente desconocido'}
                                </div>
                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {new Date(folio.deliveryDate).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-bakery-highlight bg-bakery-cream">
                    <button
                        onClick={handleNewFolioClick}
                        className="w-full flex items-center justify-center gap-2 bg-bakery-accent text-white py-3 rounded-lg hover:bg-bakery-text transition-colors font-medium shadow-sm"
                    >
                        <Plus className="h-5 w-5" /> Nuevo Pedido
                    </button>
                </div>
            </div>

            {/* Main Content / Detail View */}
            <div className={`${!isCreating && !selectedFolioId ? 'hidden md:block' : 'block'} w-full md:w-2/3 p-0 md:p-8 overflow-y-auto bg-bakery-highlight/10`}>

                {isCreating ? (
                    <div className="h-full">
                        <FolioForm onCancel={() => setIsCreating(false)} onSuccess={handleCreateSuccess} />
                    </div>
                ) : selectedFolioId ? (
                    <div className="bg-white rounded-xl shadow-sm border border-bakery-highlight p-6 min-h-full">
                        {/* Mobile Back Button */}
                        <button onClick={() => setSelectedFolioId(null)} className="md:hidden mb-4 flex items-center text-gray-500">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Volver
                        </button>

                        <div className="mb-6 flex justify-between items-center border-b pb-4">
                            <h1 className="text-2xl font-serif font-bold text-bakery-text">Detalle de Folio #{selectedFolioId}</h1>
                            {/* Acciones */}
                        </div>

                        {/* Componente Modular de PDF Asíncrono */}
                        <div className="mb-8">
                            <h3 className="font-semibold mb-3 text-bakery-text flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Documentación
                            </h3>
                            <PDFViewer endpoint={`/folios/${selectedFolioId}/pdf`} title={`Folio #${selectedFolioId}`} />
                        </div>

                        {/* Aquí irían más detalles, formularios de edición, etc */}
                        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                            <p>Pro tip: Para editar este folio, implementa el modo edición en FolioForm.</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-bakery-muted">
                        <div className="w-24 h-24 bg-bakery-highlight rounded-full flex items-center justify-center mb-6">
                            <FileText className="h-10 w-10 opacity-50 text-bakery-accent" />
                        </div>
                        <h3 className="text-xl font-serif font-medium mb-2">Selecciona un pedido</h3>
                        <p className="text-sm">o crea uno nuevo para comenzar</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FolioManager;
