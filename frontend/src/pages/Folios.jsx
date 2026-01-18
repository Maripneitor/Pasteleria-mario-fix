import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Plus, Calendar, User, DollarSign, X, Cake, Flame } from 'lucide-react';
import FolioCardSkeleton from '../components/FolioCardSkeleton';
import SwipeableFolioCard from '../components/SwipeableFolioCard';
import DigitalSignatureModal from '../components/DigitalSignatureModal';
import FolioDetailsModal from '../components/FolioDetailsModal';
import EmptyState from '../components/EmptyState';
import { sanitizeFolioList } from '../utils/folioSanitizer';

const Folios = () => {
    const [folios, setFolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);

    // Interactions State
    const [signingFolio, setSigningFolio] = useState(null); // Folio being signed
    const [selectedFolio, setSelectedFolio] = useState(null); // Folio for Details

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
        fetchFolios();
    }, []);

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
        <div className={`p-6 min-h-screen transition-colors duration-700 ${isFocusMode ? 'bg-[#0F0A06]' : 'bg-bakery-cream'}`}>

            {/* Dark Overlay for non-focus items */}
            <AnimatePresence>
                {isFocusMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black pointer-events-none z-10"
                    />
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex justify-between items-center mb-8 relative z-20">
                <div>
                    <motion.h1
                        layout
                        className={`text-3xl font-serif font-bold transition-colors duration-500 ${isFocusMode ? 'text-[#F59E0B]' : 'text-bakery-text'}`}
                    >
                        {isFocusMode ? 'Modo Cocina (Vela)' : 'Gestión de Pedidos'}
                    </motion.h1>
                    <p className={`mt-1 hidden md:block transition-colors duration-500 ${isFocusMode ? 'text-gray-400' : 'text-bakery-muted'}`}>
                        {isFocusMode ? 'Solo pedidos con entrega HOY están iluminados.' : 'Desliza: Derecha (Listo) | Izquierda (Firmar)'}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Torch Button */}
                    <button
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className={`group relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 overflow-hidden
                            ${isFocusMode
                                ? 'bg-[#2A1A10] border-[#F59E0B] text-[#F59E0B] shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        {/* Torch Flame Animation */}
                        {isFocusMode && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                            />
                        )}
                        <Flame size={18} className={`transition-colors duration-300 ${isFocusMode ? 'fill-orange-500 text-orange-600' : 'text-gray-400'}`} />
                        <span className="font-medium text-sm relative z-10">Vela</span>
                    </button>

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
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 relative z-20"
                >
                    {folios.map((folio) => {
                        const deliveryDate = new Date(`${folio.deliveryDate}T${folio.deliveryTime}`);
                        const now = new Date();

                        // Check if strictly today
                        const isToday = now.toDateString() === deliveryDate.toDateString();
                        const isUrgent = isToday;

                        return (
                            <motion.div
                                key={folio.id || folio._id || folio.folioNumber}
                                onClick={() => setSelectedFolio(folio)}
                                layout
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className={`relative rounded-2xl transition-all duration-500 cursor-pointer
                                    ${isFocusMode
                                        ? (isUrgent
                                            ? 'scale-105 z-30 shadow-[0_0_60px_rgba(251,191,36,0.5)] ring-4 ring-orange-500/60'
                                            : 'scale-90 opacity-10 blur-[3px] grayscale brightness-50 pointer-events-none')
                                        : 'scale-100 opacity-100'
                                    }
                                `}
                            >
                                {/* Torch Glow Effect Layer */}
                                {isFocusMode && isUrgent && (
                                    <>
                                        <div className="absolute -inset-4 bg-orange-500/20 blur-2xl rounded-[3rem] pointer-events-none animate-pulse"></div>
                                        <motion.div
                                            className="absolute -inset-1 border-2 border-orange-400/50 rounded-2xl z-40"
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </>
                                )}

                                <SwipeableFolioCard
                                    folio={folio}
                                    onDeliver={handleDeliverSwipe}
                                    onSign={handleSignSwipe}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* Modals remain the same */}
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
