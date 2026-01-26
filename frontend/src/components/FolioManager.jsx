import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import PDFViewer from './PDFViewer';
import FolioForm from './FolioForm'; // New Component
import { FileText, Plus, Search, Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';

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
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-surface-muted">
            {/* Sidebar List (Hidden on mobile if creating or viewing?) - For now kept simple */}
            <div className={`${isCreating || selectedFolioId ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 bg-surface border-r border-border flex-col z-10`}>
                <div className="p-4 border-b border-border bg-surface">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-brand-primary">
                        <FileText className="text-brand-primary" /> Pedidos
                    </h2>
                    <div className="relative">
                        <Input
                            placeholder="Buscar folio o cliente..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            icon={Search}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-surface">
                    {loading ? (
                        <div className="p-4 text-center text-text-secondary">Cargando...</div>
                    ) : (
                        filteredFolios.map(folio => (
                            <div
                                key={folio.id}
                                onClick={() => handleFolioSelect(folio.id)}
                                className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-surface-muted
                                    ${selectedFolioId === folio.id ? 'bg-brand-primary/5 border-l-4 border-l-brand-primary' : ''}
                                `}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-text-primary">#{folio.folioNumber}</span>
                                    <Badge variant={folio.isPaid ? 'success' : 'warning'}>
                                        {folio.isPaid ? 'Pagado' : 'Pendiente'}
                                    </Badge>
                                </div>
                                <div className="text-sm text-text-secondary flex items-center gap-1 mb-1">
                                    <User className="h-3 w-3" /> {folio.client?.name || 'Cliente desconocido'}
                                </div>
                                <div className="text-xs text-text-secondary flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {new Date(folio.deliveryDate).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-border bg-surface">
                    <Button
                        onClick={handleNewFolioClick}
                        className="w-full flex items-center justify-center gap-2"
                        variant="solid"
                    >
                        <Plus className="h-5 w-5" /> Nuevo Pedido
                    </Button>
                </div>
            </div>

            {/* Main Content / Detail View */}
            <div className={`${!isCreating && !selectedFolioId ? 'hidden md:block' : 'block'} w-full md:w-2/3 p-0 md:p-8 overflow-y-auto bg-surface-muted`}>

                {isCreating ? (
                    <div className="h-full">
                        <FolioForm onCancel={() => setIsCreating(false)} onSuccess={handleCreateSuccess} />
                    </div>
                ) : selectedFolioId ? (
                    <div className="bg-surface rounded-xl shadow-sm border border-border p-6 min-h-full">
                        {/* Mobile Back Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedFolioId(null)}
                            className="md:hidden mb-4 text-text-secondary hover:text-brand-primary"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" /> Volver
                        </Button>

                        <div className="mb-6 flex justify-between items-center border-b border-border pb-4">
                            <h1 className="text-2xl font-bold text-text-primary">Detalle de Folio #{selectedFolioId}</h1>
                            {/* Acciones */}
                        </div>

                        {/* Componente Modular de PDF Asíncrono */}
                        <div className="mb-8">
                            <h3 className="font-semibold mb-3 text-text-primary flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Documentación
                            </h3>
                            <PDFViewer endpoint={`/folios/${selectedFolioId}/pdf`} title={`Folio #${selectedFolioId}`} />
                        </div>

                        {/* Aquí irían más detalles, formularios de edición, etc */}
                        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-100">
                            <p>Pro tip: Para editar este folio, implementa el modo edición en FolioForm.</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-text-secondary">
                        <div className="w-24 h-24 bg-surface-muted rounded-full flex items-center justify-center mb-6">
                            <FileText className="h-10 w-10 opacity-50 text-brand-primary" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Selecciona un pedido</h3>
                        <p className="text-sm">o crea uno nuevo para comenzar</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FolioManager;
