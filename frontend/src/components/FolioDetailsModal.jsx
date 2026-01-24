import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Phone, Clock, Cake, Layers, PenTool } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import SignaturePadModal from './SignaturePadModal';
import api from '../api/axios';

const FolioDetailsModal = ({ folio, isOpen, onClose, onUpdate }) => {
    const [index, setIndex] = useState(-1);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [isSavingSignature, setIsSavingSignature] = useState(false);

    if (!isOpen || !folio) return null;

    // Helper to get array of images (handling JSON or single strings)
    const getImages = () => {
        if (!folio.imageUrls) return [];
        if (Array.isArray(folio.imageUrls)) {
            return folio.imageUrls.map(url => ({ src: url }));
        }
        // If it's a string (legacy or bug), wrap it
        return typeof folio.imageUrls === 'string' ? [{ src: folio.imageUrls }] : [];
    };

    const images = getImages();

    // Helper to render complex JSON fields
    const renderList = (data, title) => {
        if (!data || (Array.isArray(data) && data.length === 0)) return null;
        return (
            <div className="mb-4">
                <h4 className="font-serif font-bold text-bakery-text text-md mb-2">{title}</h4>
                <ul className="list-disc pl-5 space-y-1">
                    {Array.isArray(data) ? data.map((item, i) => (
                        <li key={i} className="text-gray-600 text-sm">
                            {typeof item === 'object' ? (item.name || JSON.stringify(item)) : item}
                        </li>
                    )) : (
                        <li className="text-gray-600 text-sm">{data}</li>
                    )}
                </ul>
            </div>
        );
    };

    const handleSignatureSave = async (signatureData) => {
        try {
            setIsSavingSignature(true);
            const formData = new FormData();
            formData.append('signature', signatureData);

            // Si el estado no es entregado, lo cambiamos a entregado al firmar? 
            // El requerimiento dice: "cuando el estado pase a Entregado... botón firmar".
            // Asumimos que si firman, confirman entrega.
            if (folio.status !== 'Entregado') {
                formData.append('status', 'Entregado');
            }

            const response = await api.put(`/folios/${folio.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (onUpdate) onUpdate(response.data);
            setIsSignatureModalOpen(false);
            onClose(); // Cerrar modal principal o mantenerlo? Mejor cerramos para refrescar o ver update.
        } catch (error) {
            console.error("Error guardando firma:", error);
            alert("Error al guardar la firma.");
        } finally {
            setIsSavingSignature(false);
        }
    };

    const canSign = folio.status === 'Entregado' || folio.status === 'Listo para Entrega';

    return (
        <>
            <AnimatePresence>
                <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-end">
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-bakery-text">Folio #{folio.folioNumber}</h2>
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border mt-2 uppercase tracking-wide
                                    ${folio.status === 'Listo para Entrega' ? 'bg-bakery-success text-green-900 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}
                                `}>
                                    {folio.status}
                                </span>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-8">

                            {/* Actions */}
                            {canSign && !folio.signature && (
                                <div className="bg-bakery-50 border border-bakery-highlight rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm">Firma de Recibido</h4>
                                        <p className="text-xs text-gray-500">Solicita la firma al entregar el pedido.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsSignatureModalOpen(true)}
                                        className="bg-bakery-accent hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
                                    >
                                        <PenTool size={16} /> Firmar Entrega
                                    </button>
                                </div>
                            )}

                            {/* Images Section */}
                            {images.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Referencias Visuales</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {images.map((img, i) => (
                                            <div
                                                key={i}
                                                className="aspect-square rounded-xl overflow-hidden cursor-pointer border border-gray-100 relative group"
                                                onClick={() => setIndex(i)}
                                            >
                                                <img src={img.src} alt={`Referencia ${i + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                    {/* Lightbox */}
                                    <Lightbox
                                        open={index >= 0}
                                        index={index}
                                        close={() => setIndex(-1)}
                                        slides={images}
                                        plugins={[Zoom]}
                                    />
                                </div>
                            )}

                            {/* Client Info */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Información del Cliente</h3>
                                <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                    <div className="flex items-center gap-3">
                                        <User className="text-bakery-accent" size={20} />
                                        <span className="font-semibold text-gray-800">{folio.client?.name || 'Cliente Casual'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="text-bakery-accent" size={20} />
                                        <a href={`tel:${folio.client?.phone}`} className="text-blue-600 hover:underline">{folio.client?.phone || 'Sin teléfono'}</a>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Fecha de Entrega</h3>
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-white border border-gray-200 p-3 rounded-xl flex items-center gap-3 shadow-sm">
                                        <Calendar className="text-bakery-muted" size={20} />
                                        <div>
                                            <div className="text-xs text-gray-400 uppercase">Fecha</div>
                                            <div className="font-medium text-gray-800">{folio.deliveryDate}</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-white border border-gray-200 p-3 rounded-xl flex items-center gap-3 shadow-sm">
                                        <Clock className="text-bakery-muted" size={20} />
                                        <div>
                                            <div className="text-xs text-gray-400 uppercase">Hora</div>
                                            <div className="font-medium text-gray-800">{folio.deliveryTime}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cake Details */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Detalles del Pastel</h3>
                                <div className="space-y-4">
                                    {renderList(folio.cakeFlavor, "Sabor del Pan")}
                                    {renderList(folio.filling, "Relleno")}

                                    <div className="flex items-start gap-3 mt-4">
                                        <Cake className="text-bakery-accent shrink-0 mt-1" size={18} />
                                        <div>
                                            <span className="font-bold text-gray-700">Diseño / Descripción</span>
                                            <div className="relative">
                                                <p className="text-gray-600 text-sm mt-1 leading-relaxed bg-bakery-cream/30 p-3 rounded-lg border border-bakery-highlight relative z-10">
                                                    {folio.designDescription || "Sin descripción específica."}
                                                </p>

                                            </div>
                                        </div>
                                    </div>

                                    {folio.shape && (
                                        <div className="flex items-center gap-3">
                                            <Layers className="text-bakery-accent shrink-0" size={18} />
                                            <span className="text-gray-700 text-sm">Forma: <strong>{folio.shape}</strong></span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Financial */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Estado Financiero</h3>
                                <div className="bg-bakery-cream p-5 rounded-xl border border-bakery-highlight flex justify-between items-center">
                                    <div>
                                        <div className="text-xs text-bakery-muted uppercase mb-1">Costo Total</div>
                                        <div className="text-xl font-bold text-gray-800">${folio.total}</div>
                                    </div>
                                    <div className="h-8 w-px bg-bakery-muted/20"></div>
                                    <div>
                                        <div className="text-xs text-bakery-muted uppercase mb-1">Anticipo</div>
                                        <div className="text-xl font-bold text-gray-600">${folio.advancePayment}</div>
                                    </div>
                                    <div className="h-8 w-px bg-bakery-muted/20"></div>
                                    <div className="text-right">
                                        <div className="text-xs text-bakery-muted uppercase mb-1">Saldo</div>
                                        <div className={`text-xl font-bold ${folio.balance > 0 ? 'text-bakery-error' : 'text-bakery-success'}`}>
                                            ${folio.balance}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Signature Display (if exists) */}
                            {folio.signature && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1 rounded-full bg-green-100 text-green-600">
                                            <Check size={14} />
                                        </div>
                                        <h3 className="text-xs font-bold text-green-600 uppercase tracking-widest">Entrega Verificada</h3>
                                    </div>

                                    <div className="border rounded-xl p-4 bg-gray-50 flex justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                        <img src={folio.signature} alt="Firma Cliente" className="max-h-32 opacity-90 mix-blend-multiply relative z-10" />
                                        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-gray-400 bg-white/80 px-2 py-0.5 rounded-full">
                                            <PenTool size={10} /> Firmado Digitalmente
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </motion.div>
                </div>

                {/* Signature Modal */}
                <SignaturePadModal
                    isOpen={isSignatureModalOpen}
                    onClose={() => setIsSignatureModalOpen(false)}
                    onSave={handleSignatureSave}
                    isSaving={isSavingSignature}
                />
            </AnimatePresence>
        </>
    );
};

// Simple check icon for display
const Check = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

export default FolioDetailsModal;
