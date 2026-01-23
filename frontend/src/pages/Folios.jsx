import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Plus, LayoutGrid, List, X } from 'lucide-react';
import FolioCardSkeleton from '../components/FolioCardSkeleton';
import SwipeableFolioCard from '../components/SwipeableFolioCard';
import DigitalSignatureModal from '../components/DigitalSignatureModal';
import FolioDetailsModal from '../components/FolioDetailsModal';
import EmptyState from '../components/EmptyState';
import { sanitizeFolioList } from '../utils/folioSanitizer';
import FolioTable from '../components/dashboard/FolioTable';

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
            setLoading(true);
            fetchFolios();
        }
    }, [user, currentBranch?.id]);

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

            await api.post('/folios', payload);
            setShowCreateModal(false);
            setFormData({
                clientName: '', clientPhone: '', deliveryDate: '', deliveryTime: '12:00',
                cakeFlavor: '', filling: '', persons: '', total: '', advancePayment: '0',
                shape: 'Redondo', designDescription: 'Pedido estándar'
            });
            fetchFolios();
        } catch (err) {
            alert('Error al crear el folio: ' + (err.response?.data?.message || err.message));
        }
    };

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
                    <FolioTable
                        folios={folios}
                        onEdit={(folio) => setSelectedFolio(folio)}
                        onPrint={(folio) => alert(`Imprimiendo ticket para folio ${folio.folioNumber}`)}
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
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.95 }}
                            className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl h-[92vh] md:h-auto md:max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                                <h2 className="text-2xl font-serif font-bold text-bakery-text">Nuevo Pedido</h2>
                                <button onClick={() => setShowCreateModal(false)} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input type="text" name="clientName" placeholder="Cliente" value={formData.clientName} onChange={handleInputChange} className="input-field border p-3 rounded-lg" required />
                                <input type="tel" name="clientPhone" placeholder="Teléfono" value={formData.clientPhone} onChange={handleInputChange} className="input-field border p-3 rounded-lg" required />
                                <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleInputChange} className="input-field border p-3 rounded-lg" required />
                                <input type="time" name="deliveryTime" value={formData.deliveryTime} onChange={handleInputChange} className="input-field border p-3 rounded-lg" required />
                                <input type="text" name="cakeFlavor" placeholder="Sabor" value={formData.cakeFlavor} onChange={handleInputChange} className="input-field border p-3 rounded-lg" required />
                                <input type="text" name="filling" placeholder="Relleno" value={formData.filling} onChange={handleInputChange} className="input-field border p-3 rounded-lg" required />
                                <input type="number" name="persons" placeholder="Personas" value={formData.persons} onChange={handleInputChange} className="input-field border p-3 rounded-lg" required />
                                <input type="number" name="total" placeholder="Total" value={formData.total} onChange={handleInputChange} className="input-field border p-3 rounded-lg" required />
                                <input type="number" name="advancePayment" placeholder="Anticipo" value={formData.advancePayment} onChange={handleInputChange} className="input-field border p-3 rounded-lg" required />
                                <div className="md:col-span-2 pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600">Cancelar</button>
                                    <button type="submit" className="px-6 py-2 bg-bakery-primary text-white rounded-lg">Guardar</button>
                                </div>
                            </form>
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
