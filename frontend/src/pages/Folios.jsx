import { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import folioService from '../services/folioService';
import { Plus, LayoutGrid, List, X, Search, Filter } from 'lucide-react';
import FolioCardSkeleton from '../components/FolioCardSkeleton';
import SwipeableFolioCard from '../components/SwipeableFolioCard';
import EmptyState from '../components/EmptyState';
import { sanitizeFolioList } from '../utils/folioSanitizer';
import FolioTable from '../components/dashboard/FolioTable';
import { useToast } from '../context/ToastSystem';
import ErrorState from '../components/common/ErrorState';

const DigitalSignatureModal = lazy(() => import('../components/DigitalSignatureModal'));
const FolioDetailsModal = lazy(() => import('../components/FolioDetailsModal'));
const FolioForm = lazy(() => import('../components/FolioForm'));


const Folios = () => {
    const { showSuccess, showError } = useToast();

    const [folios, setFolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFolios, setFilteredFolios] = useState([]);

    // Interactions State
    const [signingFolio, setSigningFolio] = useState(null); // Folio being signed
    const [selectedFolio, setSelectedFolio] = useState(null); // Folio for Details

    const { user, currentBranch } = useAuth();
    // Form State
    const [formData, setFormData] = useState({
        clientName: '',
        clientPhone: '',
        deliveryDate: '',
        deliveryTime: '12:00',
        cakeFlavor: '',
        filling: '',
        persons: '',
        total: '',
        advancePayment: '0',
        shape: 'Redondo',
        designDescription: 'Pedido estándar'
    });

    const fetchFolios = async () => {
        try {
            const dataRaw = await folioService.getAllFolios();
            // Validate response data structure before processing
            if (!dataRaw) {
                throw new Error('No data received from server');
            }

            const data = sanitizeFolioList(dataRaw);

            // Filter/Sort logic: Prioritize urgent orders (deliveryDate = today)
            const today = new Date().toISOString().split('T')[0];
            const sortedData = data.sort((a, b) => {
                const dateA = a.deliveryDate ? a.deliveryDate.split('T')[0] : '';
                const dateB = b.deliveryDate ? b.deliveryDate.split('T')[0] : '';

                if (dateA === today && dateB !== today) return -1;
                if (dateA !== today && dateB === today) return 1;
                return 0; // Keep original order otherwise
            });

            setFolios(sortedData);
        } catch (err) {
            console.error("Error loading folios:", err);
            setError('Error al cargar los folios: ' + (err.message || 'Error desconocido'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && currentBranch) {
            setLoading(true);
            fetchFolios();
        }
    }, [user, currentBranch?.id]);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredFolios(folios);
            return;
        }
        const lower = searchTerm.toLowerCase();
        const filtered = folios.filter(f =>
            f.folioNumber?.toString().toLowerCase().includes(lower) ||
            f.clientName?.toLowerCase().includes(lower) ||
            f.clientPhone?.includes(lower)
        );
        setFilteredFolios(filtered);
    }, [searchTerm, folios]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                cakeFlavor: JSON.stringify([formData.cakeFlavor]),
                filling: JSON.stringify([{ name: formData.filling, hasCost: false }]),
                persons: parseInt(formData.persons),
                total: parseFloat(formData.total),
                advancePayment: parseFloat(formData.advancePayment),
            };

            await folioService.createFolio(payload);
            setShowCreateModal(false);
            setFormData({
                clientName: '', clientPhone: '', deliveryDate: '', deliveryTime: '12:00',
                cakeFlavor: '', filling: '', persons: '', total: '', advancePayment: '0',
                shape: 'Redondo', designDescription: 'Pedido estándar'
            });
            fetchFolios();
            showSuccess(`Folio para ${payload.clientName} creado correctamente.`);
        } catch (err) {
            showError('Error al crear el folio: ' + (err.response?.data?.message || err.message));
        }
    };

    // --- Interaction Handlers ---

    const handleDeliverSwipe = async (folio) => {
        try {
            await folioService.updateFolioStatus(folio.id || folio._id || folio.folioNumber, { status: 'Listo para Entrega' });
            setFolios(prev => prev.map(f => f.id === folio.id ? { ...f, status: 'Listo para Entrega' } : f));
        } catch (err) {
            console.error("Error updating status via swipe", err);
            fetchFolios();
        }
    };

    const handleSignSwipe = (folio) => {
        setSigningFolio(folio);
    };

    const handleSignatureSave = async (signatureDataUrl) => {
        if (!signingFolio) return;
        try {
            await folioService.updateFolioStatus(signingFolio.id || signingFolio._id || signingFolio.folioNumber, {
                status: 'Entregado',
                signature: signatureDataUrl
            });
            setSigningFolio(null);
            showSuccess('Firma guardada correctamente.');
        } catch (err) {
            showError("Error al guardar la firma: " + err.message);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="p-6 min-h-screen bg-bakery-50 dark:bg-bakery-950 transition-colors duration-300">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-20">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-bakery-text dark:text-bakery-milk transition-colors flex items-center gap-3">
                        Gestión de Pedidos
                        <span className="text-sm font-sans font-normal bg-bakery-100 dark:bg-bakery-800 text-bakery-primary px-3 py-1 rounded-full">
                            {folios.length}
                        </span>
                    </h1>
                    <p className="mt-1 hidden md:block text-bakery-muted dark:text-gray-400 text-sm">
                        Administra, produce y entrega pedidos eficientemente.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-grow md:flex-grow-0 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-bakery-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full md:w-64 pl-10 pr-3 py-2.5 border border-gray-200 dark:border-bakery-700 rounded-xl leading-5 bg-white dark:bg-bakery-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bakery-primary/50 focus:border-bakery-primary transition-all shadow-sm"
                            placeholder="Buscar folio, cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden md:block mx-1"></div>

                    {/* View Toggles */}
                    <div className="flex bg-white dark:bg-bakery-800 rounded-lg p-1 border border-gray-200 dark:border-bakery-700 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-bakery-100 dark:bg-bakery-700 text-bakery-primary shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-bakery-primary hover:bg-gray-50 dark:hover:bg-bakery-700/50'}`}
                            title="Vista Grid"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-bakery-100 dark:bg-bakery-700 text-bakery-primary shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-bakery-primary hover:bg-gray-50 dark:hover:bg-bakery-700/50'}`}
                            title="Vista Lista"
                        >
                            <List size={18} />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button onClick={() => {
                            // CSV Export logic
                            const headers = ['Folio', 'Cliente', 'Teléfono', 'Fecha', 'Sabor', 'Total', 'Estado'];
                            const rows = filteredFolios.map(f => [
                                f.folioNumber,
                                f.clientName,
                                f.clientPhone,
                                f.deliveryDate,
                                Array.isArray(f.cakeFlavor) ? f.cakeFlavor[0] : f.cakeFlavor,
                                f.total,
                                f.status
                            ]);
                            const csvContent = "data:text/csv;charset=utf-8,"
                                + headers.join(",") + "\n"
                                + rows.map(e => e.join(",")).join("\n");
                            const encodedUri = encodeURI(csvContent);
                            const link = document.createElement("a");
                            link.setAttribute("href", encodedUri);
                            link.setAttribute("download", "pedidos.csv");
                            document.body.appendChild(link);
                            link.click();
                        }} className="hidden md:flex items-center justify-center p-2.5 text-gray-500 hover:bg-white hover:text-bakery-primary hover:shadow-sm rounded-xl border border-transparent hover:border-gray-200 transition-all font-medium" title="Exportar CSV">
                            <span className="text-sm">Exportar</span>
                        </button>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-bakery-primary hover:bg-bakery-accent text-white px-4 py-2.5 rounded-xl shadow-lg shadow-bakery-primary/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ml-auto md:ml-0"
                        >
                            <Plus size={20} strokeWidth={2.5} />
                            <span className="font-semibold hidden md:inline">Nuevo Pedido</span>
                            <span className="font-semibold md:hidden">Nuevo</span>
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => <FolioCardSkeleton key={i} />)}
                </div>
            ) : error ? (
                <div className="flex justify-center py-20">
                    <ErrorState
                        message={error}
                        onRetry={() => {
                            setError('');
                            setLoading(true);
                            fetchFolios();
                        }}
                    />
                </div>
            ) : filteredFolios.length === 0 ? (
                // Added Empty State for search results
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Search size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">No se encontraron resultados</h3>
                    <p className="text-gray-500 max-w-xs">
                        No hay pedidos que coincidan con "{searchTerm}". Intenta con otros términos.
                    </p>
                    <button
                        onClick={() => setSearchTerm('')}
                        className="mt-4 text-bakery-primary font-medium hover:underline"
                    >
                        Limpiar búsqueda
                    </button>
                </div>
            ) : (
                viewMode === 'grid' ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 relative z-20"
                    >
                        {filteredFolios.map((folio) => (
                            <motion.div
                                key={folio.id || folio._id || folio.folioNumber}
                                onClick={() => setSelectedFolio(folio)}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="relative rounded-2xl transition-all duration-500 cursor-pointer scale-100 opacity-100 h-full"
                            >
                                <SwipeableFolioCard
                                    folio={folio}
                                    onDeliver={handleDeliverSwipe}
                                    onSign={handleSignSwipe}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <FolioTable
                        folios={filteredFolios}
                        onEdit={(folio) => setSelectedFolio(folio)}
                        onPrint={(folio) => {
                            // PDF Export Logic
                            const token = localStorage.getItem('token');
                            // Ensure backend URL is correct. Assuming relative path via proxy or full URL.
                            // Since api instance has baseURL, we need to construct it carefully or use absolute if known.
                            // If VITE_API_URL is set, use it.
                            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                            const id = folio.id || folio._id || folio.folioNumber;
                            window.open(`${baseUrl}/folios/${id}/pdf?token=${token}`, '_blank');
                        }}
                        onWhatsApp={(folio) => {
                            const message = `Hola ${folio.clientName}, su pedido #${folio.folioNumber} está listo.`;
                            window.open(`https://wa.me/${folio.clientPhone}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        onViewDetails={(folio) => setSelectedFolio(folio)}
                    />
                )
            )}

            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
                        <div className="w-full md:max-w-6xl h-[95vh] md:h-[90vh] bg-white dark:bg-bakery-950 rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden relative">
                            <Suspense fallback={<div className="h-full flex items-center justify-center">Cargando formulario...</div>}>
                                <FolioForm
                                    onCancel={() => setShowCreateModal(false)}
                                    onSuccess={() => {
                                        setShowCreateModal(false);
                                        fetchFolios();
                                        showSuccess('Pedido creado exitosamente.');
                                    }}
                                />
                            </Suspense>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <Suspense fallback={null}>
                <DigitalSignatureModal
                    isOpen={!!signingFolio}
                    onClose={() => setSigningFolio(null)}
                    onSave={handleSignatureSave}
                />
            </Suspense>

            <Suspense fallback={null}>
                <FolioDetailsModal
                    folio={selectedFolio}
                    isOpen={!!selectedFolio}
                    onClose={() => setSelectedFolio(null)}
                />
            </Suspense>
        </div>
    );
};

export default Folios;
