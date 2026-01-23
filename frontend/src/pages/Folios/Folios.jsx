import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api/client';
import { Plus, Calendar, User, DollarSign, X, Cake, Flame, LayoutGrid, List } from 'lucide-react';
import FolioCardSkeleton from '../../components/features/folios/FolioCardSkeleton';
import SwipeableFolioCard from '../../components/features/folios/SwipeableFolioCard';
import DigitalSignatureModal from '../../components/DigitalSignatureModal';
import FolioDetailsModal from '../../components/features/folios/FolioDetailsModal';
import EmptyState from '../../components/ui/EmptyState';
import { sanitizeFolioList } from '../../utils/folioSanitizer';
import FolioForm from '../../components/features/folios/FolioForm';

const Folios = () => {
    const [folios, setFolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'


    // Interactions State
    const [signingFolio, setSigningFolio] = useState(null); // Folio being signed
    const [selectedFolio, setSelectedFolio] = useState(null); // Folio for Details

    const { user, currentBranch } = useAuth();
    const navigate = useNavigate();
    const fetchFolios = async () => {
        try {
            const response = await api.get('/folios');
            setFolios(sanitizeFolioList(response.data));
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los folios.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && currentBranch) {
            setLoading(true); // Ensure loading state is reset when switching branches
            fetchFolios();
        }
    }, [user, currentBranch?.id]); // FIX: Dependency on ID guarantees reload on switch

    // --- Interaction Handlers ---

    const handleDeliverSwipe = async (folio) => {
        try {
            await api.put(`/folios/${folio.id || folio._id || folio.folioNumber}`, { status: 'Listo para Entrega' });
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
            await api.put(`/folios/${signingFolio.id || signingFolio._id || signingFolio.folioNumber}`, {
                status: 'Entregado',
                signature: signatureDataUrl
            });
            setSigningFolio(null);
            fetchFolios();
        } catch (err) {
            alert("Error al guardar la firma: " + err.message);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="p-6 min-h-screen bg-bakery-50 dark:bg-bakery-950 transition-colors duration-300">

            {/* Header */}
            <div className="flex justify-between items-center mb-8 relative z-20">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-bakery-text dark:text-bakery-milk transition-colors">
                        Gestión de Pedidos
                    </h1>
                    <p className="mt-1 hidden md:block text-bakery-muted dark:text-gray-400">
                        Desliza: Derecha (Listo) | Izquierda (Firmar)
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-white dark:bg-bakery-800 rounded-lg p-1 border border-gray-200 dark:border-bakery-700 mr-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-bakery-100 dark:bg-bakery-700 text-bakery-primary' : 'text-gray-400 dark:text-gray-500 hover:text-bakery-primary'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-bakery-100 dark:bg-bakery-700 text-bakery-primary' : 'text-gray-400 dark:text-gray-500 hover:text-bakery-primary'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-bakery-primary hover:bg-bakery-accent text-white px-5 py-2.5 rounded-xl shadow-lg shadow-bakery-primary/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                        <span className="font-semibold hidden md:inline">Nuevo</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => <FolioCardSkeleton key={i} />)}
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-bakery-error/20">
                    <div className="text-bakery-error mb-2">Error al cargar</div>
                    <div className="text-gray-500">{error}</div>
                </div>
            ) : folios.length === 0 ? (
                <EmptyState
                    message="No hay pedidos registrados."
                    subMessage="¡Es un buen momento para crear el primero!"
                    action={
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-bakery-primary hover:bg-bakery-accent text-white px-5 py-2.5 rounded-xl shadow-lg mt-4"
                        >
                            Crear Nuevo Pedido
                        </button>
                    }
                />
            ) : (
                viewMode === 'grid' ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 relative z-20"
                    >
                        {folios.map((folio) => (
                            <motion.div
                                key={folio.id || folio._id || folio.folioNumber}
                                onClick={() => setSelectedFolio(folio)}
                                layout
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="relative rounded-2xl transition-all duration-500 cursor-pointer scale-100 opacity-100"
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
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                                <thead className="bg-gray-50 dark:bg-slate-800 text-xs uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Folio</th>
                                        <th className="px-6 py-4">Cliente</th>
                                        <th className="px-6 py-4">Fecha Entrega</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                    {folios.map((folio) => (
                                        <tr
                                            key={folio.id}
                                            onClick={() => setSelectedFolio(folio)}
                                            className="hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">#{folio.folioNumber}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{folio.clientName}</td>
                                            <td className="px-6 py-4">{folio.deliveryDate}</td>
                                            <td className="px-6 py-4 text-green-600 dark:text-green-400 font-bold">${folio.total}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                                    ${folio.status === 'Entregado' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        folio.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                    {folio.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            )}

            {/* Modals remain the same */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.95 }}
                            className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-5xl h-[92vh] md:max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            {/* FolioForm handles its own scrolling and layout which matches this container size */}
                            <FolioForm
                                onSuccess={() => {
                                    setShowCreateModal(false);
                                    fetchFolios();
                                    // Optional: Show success toast handled by FolioForm or here
                                }}
                                onCancel={() => setShowCreateModal(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <DigitalSignatureModal
                isOpen={!!signingFolio}
                onClose={() => setSigningFolio(null)}
                onSave={handleSignatureSave}
            />

            <FolioDetailsModal
                folio={selectedFolio}
                isOpen={!!selectedFolio}
                onClose={() => setSelectedFolio(null)}
            />
        </div>
    );
};

export default Folios;
