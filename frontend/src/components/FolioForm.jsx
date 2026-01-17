import React, { useState, useEffect, useCallback } from 'react';
import { Save, Mic, Calculator, ArrowLeft, Plus, Trash, AlertCircle } from 'lucide-react';
import api from '../services/api'; // Ensure this exists and is configured
import DictationFeedback from './DictationFeedback';

const FolioForm = ({ onCancel, onSuccess }) => {
    // --- State ---
    const [loading, setLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [dictationStatus, setDictationStatus] = useState('idle'); // idle, listening, processing, success, error

    // Catalogues
    const [flavors, setFlavors] = useState([]);
    const [fillings, setFillings] = useState([]);

    // Form Data
    const [formData, setFormData] = useState({
        clientName: '',
        clientPhone: '',
        clientPhone2: '',
        deliveryDate: '',
        deliveryTime: '',
        folioType: 'Normal', // Normal, Base/Especial
        persons: 20,
        cakeFlavor: [], // Array of selected flavors
        filling: [], // Array of selected fillings names
        shape: 'Redondo',
        designDescription: '',
        dedication: '',
        total: 0, // Base price
        advancePayment: 0,
        deliveryCost: 0,
        addCommissionToCustomer: false,
        additional: [], // [{ description: '', price: 0 }]
        status: 'Nuevo'
    });

    // Calculated Totals
    const [totals, setTotals] = useState({
        subtotal: 0,
        fillingCost: 0,
        commission: 0,
        total: 0,
        anticipoMinimo: 0
    });

    // --- Effects ---

    // Load catalogues
    useEffect(() => {
        const loadCatalogues = async () => {
            try {
                const [resFlavors, resFillings] = await Promise.all([
                    api.get('/ingredients/flavors'),
                    api.get('/ingredients/fillings')
                ]);
                setFlavors(resFlavors.data || []);
                setFillings(resFillings.data || []);
            } catch (error) {
                console.error("Error loading catalogues", error);
            }
        };
        loadCatalogues();
    }, []);

    // Debounced Calculation
    useEffect(() => {
        const calculate = async () => {
            if (!formData.persons || !formData.total) return;

            setCalculating(true);
            try {
                const res = await api.post('/folios/calculate', {
                    persons: formData.persons,
                    folioType: formData.folioType,
                    filling: formData.filling,
                    total: formData.total,
                    additional: formData.additional,
                    deliveryCost: formData.deliveryCost,
                    addCommissionToCustomer: formData.addCommissionToCustomer,
                    advancePayment: formData.advancePayment
                });
                setTotals(res.data);
            } catch (error) {
                console.error("Calculation error", error);
            } finally {
                setCalculating(false);
            }
        };

        const timer = setTimeout(calculate, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [
        formData.persons,
        formData.folioType,
        formData.filling,
        formData.total,
        formData.additional,
        formData.deliveryCost,
        formData.addCommissionToCustomer,
        formData.advancePayment
    ]);

    // --- Handlers ---

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleArrayChange = (field, value) => {
        setFormData(prev => {
            const current = prev[field] || [];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...current, value] };
            }
        });
    };

    const handleAddAdditional = () => {
        setFormData(prev => ({
            ...prev,
            additional: [...prev.additional, { description: '', price: 0 }]
        }));
    };

    const handleUpdateAdditional = (index, field, value) => {
        const newAdditional = [...formData.additional];
        newAdditional[index][field] = value;
        setFormData(prev => ({ ...prev, additional: newAdditional }));
    };

    const handleRemoveAdditional = (index) => {
        const newAdditional = formData.additional.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, additional: newAdditional }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/folios', {
                ...formData,
                isPaid: formData.advancePayment >= totals.total // Simple logic, backend confirms
            });
            onSuccess();
        } catch (error) {
            console.error("Error creating folio", error);
            alert("Error al crear el folio. Verifique los datos.");
        } finally {
            setLoading(false);
        }
    };

    // Mock Dictation Handler
    const handleDictation = () => {
        if (dictationStatus === 'listening') {
            setDictationStatus('processing');
            setTimeout(() => {
                setDictationStatus('success');
                setTimeout(() => setDictationStatus('idle'), 2000);
            }, 2000);
        } else {
            setDictationStatus('listening');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col max-h-full">
            {/* Header */}
            <div className="bg-bakery-cream p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button onClick={onCancel} className="p-2 hover:bg-black/5 rounded-full">
                        <ArrowLeft className="h-5 w-5 text-bakery-text" />
                    </button>
                    <h2 className="text-xl font-serif text-bakery-text font-bold">Nuevo Pedido</h2>
                </div>
                <button
                    onClick={handleDictation}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${dictationStatus === 'listening'
                            ? 'bg-red-100 text-red-600 ring-2 ring-red-400 ring-offset-2'
                            : 'bg-white border text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Mic className={`h-4 w-4 ${dictationStatus === 'listening' ? 'animate-pulse' : ''}`} />
                    {dictationStatus === 'listening' ? 'Escuchando...' : 'Dictar Pedido'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <form id="folio-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* --- Sección Cliente --- */}
                    <div className="md:col-span-12">
                        <h3 className="text-lg font-serif font-semibold text-bakery-text mb-4 border-b pb-2">Datos del Cliente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input required name="clientPhone" value={formData.clientPhone} onChange={handleChange} placeholder="Teléfono Principal*" className="input-bakery" />
                            <input required name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Nombre Completo*" className="input-bakery" />
                            <input name="clientPhone2" value={formData.clientPhone2} onChange={handleChange} placeholder="Teléfono Secundario" className="input-bakery" />
                        </div>
                    </div>

                    {/* --- Sección Detalles del Pedido --- */}
                    <div className="md:col-span-8 space-y-6">
                        {/* Fecha y Hora */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label-bakery">Fecha de Entrega</label>
                                <input required type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} className="input-bakery" />
                            </div>
                            <div>
                                <label className="label-bakery">Hora</label>
                                <input required type="time" name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} className="input-bakery" />
                            </div>
                        </div>

                        {/* Especificaciones */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label-bakery">Tipo de Pastel</label>
                                <select name="folioType" value={formData.folioType} onChange={handleChange} className="input-bakery">
                                    <option value="Normal">Normal</option>
                                    <option value="Base/Especial">Base/Especial</option>
                                </select>
                            </div>
                            <div>
                                <label className="label-bakery">Personas</label>
                                <input type="number" name="persons" value={formData.persons} onChange={handleChange} className="input-bakery" />
                            </div>
                        </div>

                        {/* Sabores y Rellenos */}
                        <div>
                            <label className="label-bakery block mb-2">Sabores de Pan</label>
                            <div className="flex flex-wrap gap-2">
                                {flavors.map(f => (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => handleArrayChange('cakeFlavor', f.name)}
                                        className={`chip-bakery ${formData.cakeFlavor.includes(f.name) ? 'active' : ''}`}
                                    >
                                        {f.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="label-bakery block mb-2">Rellenos</label>
                            <div className="flex flex-wrap gap-2">
                                {fillings.map(f => (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => handleArrayChange('filling', f.name)}
                                        className={`chip-bakery ${formData.filling.includes(f.name) ? 'active' : ''}`}
                                    >
                                        {f.name} {f.price > 0 && <span className="text-xs ml-1 opacity-70">(${f.price})</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Descripción y Dedicatoria */}
                        <textarea name="designDescription" value={formData.designDescription} onChange={handleChange} placeholder="Descripción del diseño..." className="input-bakery md:col-span-2 h-24" />
                        <input name="dedication" value={formData.dedication} onChange={handleChange} placeholder="Dedicatoria (opcional)" className="input-bakery md:col-span-2" />

                        {/* Adicionales */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="label-bakery">Adicionales / Extras</label>
                                <button type="button" onClick={handleAddAdditional} className="text-sm text-blue-600 hover:underline flex items-center">
                                    <Plus className="h-3 w-3 mr-1" /> Agregar Item
                                </button>
                            </div>
                            {formData.additional.map((item, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        placeholder="Descripción"
                                        value={item.description}
                                        onChange={(e) => handleUpdateAdditional(index, 'description', e.target.value)}
                                        className="input-bakery flex-1"
                                    />
                                    <input
                                        type="number"
                                        placeholder="$"
                                        value={item.price}
                                        onChange={(e) => handleUpdateAdditional(index, 'price', e.target.value)}
                                        className="input-bakery w-24"
                                    />
                                    <button type="button" onClick={() => handleRemoveAdditional(index)} className="text-red-400 hover:text-red-600 p-2">
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- Sección Totales (Sticky) --- */}
                    <div className="md:col-span-4">
                        <div className="bg-bakery-highlight/30 p-6 rounded-xl border border-bakery-accent/20 sticky top-0">
                            <h3 className="text-lg font-serif font-bold text-bakery-text mb-4 flex items-center gap-2">
                                <Calculator className="h-5 w-5" /> Resumen
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div>
                                    <label className="text-gray-600 text-xs uppercase tracking-wider">Precio Base</label>
                                    <div className="flex items-center mt-1">
                                        <span className="text-gray-500 mr-2">$</span>
                                        <input
                                            type="number"
                                            name="total"
                                            value={formData.total}
                                            onChange={handleChange}
                                            className="w-full bg-white border rounded px-2 py-1 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Costo Rellenos:</span>
                                    <span className="font-medium">+${totals.fillingCost}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Costo Extras:</span>
                                    <span className="font-medium">+${formData.additional.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0)}</span>
                                </div>

                                <div>
                                    <label className="text-gray-600 text-xs uppercase tracking-wider">Envío</label>
                                    <div className="flex items-center mt-1">
                                        <span className="text-gray-500 mr-2">$</span>
                                        <input
                                            type="number"
                                            name="deliveryCost"
                                            value={formData.deliveryCost}
                                            onChange={handleChange}
                                            className="w-full bg-white border rounded px-2 py-1 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-2 border-t border-dashed border-gray-300">
                                    <span className="text-gray-700">Comisión (5%)</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="addCommissionToCustomer" checked={formData.addCommissionToCustomer} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-bakery-accent"></div>
                                    </label>
                                </div>
                                {formData.addCommissionToCustomer && (
                                    <div className="flex justify-between text-bakery-accent font-medium">
                                        <span>+ Comisión:</span>
                                        <span>${totals.commission}</span>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-400 mt-2">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xl font-bold text-bakery-text">TOTAL:</span>
                                        <span className="text-2xl font-bold text-bakery-primary">${totals.total}</span>
                                    </div>
                                    <div className="text-xs text-right text-gray-500">
                                        Anticipo Mínimo Recomendado: ${totals.anticipoMinimo}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="text-gray-600 text-xs uppercase tracking-wider">Anticipo Recibido</label>
                                    <div className="flex items-center mt-1">
                                        <span className="text-green-600 font-bold mr-2">$</span>
                                        <input
                                            type="number"
                                            name="advancePayment"
                                            value={formData.advancePayment}
                                            onChange={handleChange}
                                            className="w-full bg-green-50 border border-green-200 rounded px-2 py-2 font-bold text-green-800"
                                        />
                                    </div>
                                    <div className="text-right mt-1 text-sm">
                                        <span className="text-gray-500">Resta: </span>
                                        <span className={`font-bold ${totals.total - formData.advancePayment <= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            ${Math.max(0, totals.total - formData.advancePayment)}
                                        </span>
                                    </div>
                                </div>

                                {calculating && (
                                    <div className="text-xs text-center text-blue-500 animate-pulse mt-2">
                                        Calculando...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                <button onClick={onCancel} className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-200 font-medium">
                    Cancelar
                </button>
                <button
                    type="submit"
                    form="folio-form"
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-bakery-accent text-white hover:bg-bakery-text hover:shadow-lg transition-all font-medium flex items-center gap-2"
                >
                    {loading ? 'Guardando...' : <><Save className="h-4 w-4" /> Guardar Pedido</>}
                </button>
            </div>

            <DictationFeedback status={dictationStatus} />
        </div>
    );
};

export default FolioForm;
