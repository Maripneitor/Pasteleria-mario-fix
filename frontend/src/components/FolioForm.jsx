import React, { useMemo, useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { Save, ArrowLeft, Trash, Plus, Calculator, Mic, Sparkles } from 'lucide-react';
import IngredientPicker from './IngredientPicker';
import VoiceDictationModal from './VoiceDictationModal';
import AiSidebar from './AiSidebar';
import ImageAnalyzer from './ImageAnalyzer';
import api from '../services/api';

// --- Constants & Helpers ---
const BLOCKED_FLAVORS = ['Mil Hojas', 'Pastel de Queso'];
const TIER_DEFAULTS = { persons: 20, flavor: [], filling: [] };

const FolioForm = ({ onCancel, onSuccess, initialData }) => {
    // --- State for AI Features ---
    const [isDictationOpen, setIsDictationOpen] = useState(false);

    // --- React Hook Form Setup ---
    const { register, control, handleSubmit, setValue, getValues, formState: { errors, isSubmitting } } = useForm({
        defaultValues: initialData || {
            clientName: '',
            clientPhone: '',
            deliveryDate: '',
            deliveryTime: '12:00',
            folioType: 'Normal', // 'Normal' or 'Base/Especial'
            persons: 20,
            cakeFlavor: [],
            filling: [],
            tiers: [], // For 'Base/Especial'
            additional: [],
            total: 0, // Base price input
            deliveryCost: 0,
            advancePayment: 0,
            addCommissionToCustomer: false,
            shape: 'Redondo',
            designDescription: '',
            originalDescription: '' // To store AI analysis backup
        }
    });

    const { fields: additionalFields, append: appendAdditional, remove: removeAdditional } = useFieldArray({
        control,
        name: 'additional'
    });

    const { fields: tierFields, append: appendTier, remove: removeTier } = useFieldArray({
        control,
        name: 'tiers'
    });

    // --- Watch Values for Calculations & Logic ---
    const folioType = useWatch({ control, name: 'folioType' });
    const watchedTotal = useWatch({ control, name: 'total' }) || 0;
    const watchedAdditional = useWatch({ control, name: 'additional' }) || [];
    const watchedDelivery = useWatch({ control, name: 'deliveryCost' }) || 0;
    const watchedCommission = useWatch({ control, name: 'addCommissionToCustomer' });
    const watchedAdvance = useWatch({ control, name: 'advancePayment' }) || 0;
    const watchedFlavors = useWatch({ control, name: 'cakeFlavor' }) || [];
    const watchedFillings = useWatch({ control, name: 'filling' }) || [];

    // Watch all for AI Sidebar
    const allValues = useWatch({ control });

    // --- Business Logic 1: Blocking Fillings ---
    const isFillingBlocked = useMemo(() => {
        return watchedFlavors.some(f => BLOCKED_FLAVORS.includes(f));
    }, [watchedFlavors]);

    useEffect(() => {
        if (isFillingBlocked && watchedFillings.length > 0) {
            setValue('filling', []); // Clear fillings if blocked flavor selected
        }
    }, [isFillingBlocked, watchedFillings, setValue]);

    // --- Business Logic 2: Real-time Calculations (useMemo) ---
    const calculations = useMemo(() => {
        const base = parseFloat(watchedTotal) || 0;
        const extras = watchedAdditional.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);
        const delivery = parseFloat(watchedDelivery) || 0;

        let subtotal = base + extras + delivery;

        // Commission: 5% rounded to nearest 10 (decena)
        let commission = 0;
        if (watchedCommission) {
            const rawCommission = subtotal * 0.05;
            commission = Math.ceil(rawCommission / 10) * 10;
        }

        const grandTotal = subtotal + commission;
        const minAdvance = Math.ceil((grandTotal * 0.5) / 10) * 10; // 50% also rounded for cleanliness, assuming user preference
        const balance = Math.max(0, grandTotal - parseFloat(watchedAdvance));

        return {
            subtotal,
            commission,
            total: grandTotal,
            minAdvance,
            balance
        };
    }, [watchedTotal, watchedAdditional, watchedDelivery, watchedCommission, watchedAdvance]);


    // --- AI Feature Handlers ---
    const handleDictationComplete = (data) => {
        // Map dictionary data to form fields
        if (data.clientName) setValue('clientName', data.clientName);
        if (data.persons) setValue('persons', data.persons);
        if (data.cakeFlavor) setValue('cakeFlavor', data.cakeFlavor); // Array expected
        if (data.filling) setValue('filling', data.filling); // Array expected
        if (data.designDescription) setValue('designDescription', data.designDescription);
        if (data.shape) setValue('shape', data.shape);
        if (data.folioType) setValue('folioType', data.folioType);

        setIsDictationOpen(false);
    };

    const handleImageAnalysis = (analysisText) => {
        const currentDesc = getValues('designDescription');
        setValue('designDescription', (currentDesc ? currentDesc + '\n\n' : '') + analysisText);
    };

    // --- Form Submission ---
    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                // Ensure number types
                persons: parseInt(data.persons),
                total: parseFloat(data.total),
                deliveryCost: parseFloat(data.deliveryCost),
                advancePayment: parseFloat(data.advancePayment),
                isPaid: parseFloat(data.advancePayment) >= calculations.total,
                // Map filling to objects if backend expects {name, hasCost}
                filling: data.filling.map(f => ({ name: f, hasCost: false })), // Simplified for now
                // Tiers mapping if active
                tiers: folioType === 'Base/Especial' ? data.tiers : [],
            };

            await api.post('/folios', payload);
            if (onSuccess) onSuccess();
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg flex flex-col h-full max-h-screen overflow-hidden relative">
            <VoiceDictationModal
                isOpen={isDictationOpen}
                onClose={() => setIsDictationOpen(false)}
                onDictationComplete={handleDictationComplete}
            />

            {/* Header */}
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft className="text-gray-600" size={20} />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">
                        {initialData ? 'Editar Pedido' : 'Nuevo Pedido'}
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setIsDictationOpen(true)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors animate-pulse"
                    >
                        <Mic size={18} />
                        Dictar
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                        <Save size={18} />
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto w-full">
                <div className="flex flex-col lg:flex-row h-full">

                    {/* LEFT COLUMN: Main Form */}
                    <div className="flex-1 p-6 md:p-8 space-y-8">

                        {/* Section: Client */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-700 border-b pb-2">Información del Cliente</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Nombre Completo</label>
                                    <input
                                        {...register('clientName', { required: 'Nombre requerido' })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Ej. María López"
                                    />
                                    {errors.clientName && <span className="text-red-500 text-xs">{errors.clientName.message}</span>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono</label>
                                        <input
                                            {...register('clientPhone', { required: 'Teléfono requerido' })}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="10 dígitos"
                                        />
                                        {errors.clientPhone && <span className="text-red-500 text-xs">{errors.clientPhone.message}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Entrega</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="date"
                                                {...register('deliveryDate', { required: true })}
                                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                            <input
                                                type="time"
                                                {...register('deliveryTime')}
                                                className="w-24 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: Cake Details */}
                        <section className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="text-lg font-bold text-gray-700">Detalles del Pastel</h3>
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        type="button"
                                        onClick={() => setValue('folioType', 'Normal')}
                                        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${folioType === 'Normal' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                                    >
                                        Normal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setValue('folioType', 'Base/Especial')}
                                        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${folioType === 'Base/Especial' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                                    >
                                        Base / Especial
                                    </button>
                                </div>
                            </div>

                            {/* Normal Mode */}
                            {folioType === 'Normal' && (
                                <div className="space-y-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Tamaño (Personas)</label>
                                            <input
                                                type="number"
                                                {...register('persons')}
                                                className="w-full border border-gray-300 rounded-lg p-2.5"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Forma</label>
                                            <select {...register('shape')} className="w-full border border-gray-300 rounded-lg p-2.5 bg-white">
                                                <option value="Redondo">Redondo</option>
                                                <option value="Cuadrado">Cuadrado</option>
                                                <option value="Plancha">Plancha</option>
                                                <option value="Rectangular">Rectangular</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <IngredientPicker
                                            type="flavor"
                                            label="Sabor del Pan"
                                            selected={watchedFlavors}
                                            onChange={(val) => setValue('cakeFlavor', val)}
                                        />

                                        <div className="relative">
                                            {isFillingBlocked && (
                                                <div className="absolute -top-6 right-0 text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded border border-orange-100">
                                                    Sin relleno para este sabor
                                                </div>
                                            )}
                                            <IngredientPicker
                                                type="filling"
                                                label="Relleno"
                                                selected={watchedFillings}
                                                onChange={(val) => setValue('filling', val)}
                                                disabled={isFillingBlocked}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Multi-Tier Mode */}
                            {folioType === 'Base/Especial' && (
                                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full border-collapse">
                                        <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                                            <tr>
                                                <th className="p-3 text-left">Piso</th>
                                                <th className="p-3 text-left">Personas</th>
                                                <th className="p-3 text-left">Sabor</th>
                                                <th className="p-3 text-left">Relleno</th>
                                                <th className="p-3 text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {tierFields.map((field, index) => (
                                                <tr key={field.id}>
                                                    <td className="p-3 font-medium text-gray-500">#{index + 1}</td>
                                                    <td className="p-3">
                                                        <input
                                                            {...register(`tiers.${index}.persons`)}
                                                            className="w-16 border rounded p-1 text-sm"
                                                            placeholder="Pax"
                                                            type="number"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        {/* Simplified selector for table */}
                                                        <input
                                                            {...register(`tiers.${index}.flavor`)}
                                                            className="w-full border rounded p-1 text-sm"
                                                            placeholder="Sabor"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <input
                                                            {...register(`tiers.${index}.filling`)}
                                                            className="w-full border rounded p-1 text-sm"
                                                            placeholder="Relleno"
                                                        />
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <button type="button" onClick={() => removeTier(index)} className="text-red-400 hover:text-red-600">
                                                            <Trash size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {tierFields.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="p-6 text-center text-gray-400 text-sm">
                                                        Agrega pisos a tu estructura
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td colSpan="5" className="p-2 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => appendTier(TIER_DEFAULTS)}
                                                        className="text-blue-600 text-sm font-medium hover:underline flex items-center justify-center gap-1"
                                                    >
                                                        <Plus size={16} /> Agregar Piso
                                                    </button>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}

                            {/* Descripción & IA Image Analysis */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Descripción / Diseño</label>
                                    <textarea
                                        {...register('designDescription')}
                                        className="w-full border border-gray-300 rounded-lg p-3 h-48 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                        placeholder="Detalles específicos del decorado..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                                        <Sparkles size={14} className="text-purple-500" />
                                        Análisis Visual
                                    </label>
                                    <ImageAnalyzer onAnalysisComplete={handleImageAnalysis} />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Calculations & AI Sidebar */}
                    <div className="lg:w-80 border-l border-gray-100 flex flex-col bg-gray-50 max-h-screen overflow-hidden">

                        {/* AI Suggestions Sidebar (Top Half) */}
                        <div className="flex-1 overflow-y-auto border-b border-gray-200">
                            <AiSidebar formValues={allValues} />
                        </div>

                        {/* Calculations Panel (Bottom Half) */}
                        <div className="p-6 bg-white shadow-up z-10">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <Calculator className="text-blue-500" />
                                Totales
                            </h3>

                            {/* Re-implementing compact calc view for sidebar */}
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between items-center">
                                    <span>Base</span>
                                    <input type="number" {...register('total')} className="w-20 text-right border rounded p-1" placeholder="0" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Envío</span>
                                    <input type="number" {...register('deliveryCost')} className="w-20 text-right border rounded p-1" placeholder="0" />
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>Extras ({watchedAdditional.length})</span>
                                    <span>${watchedAdditional.reduce((acc, i) => acc + (parseFloat(i.price) || 0), 0)}</span>
                                </div>
                            </div>

                            {/* Dynamic Extras List Condensed */}
                            <div className="mb-4">
                                <button type="button" onClick={() => appendAdditional({ description: '', price: 0 })} className="text-xs text-blue-500 hover:underline flex items-center gap-1 mb-1">
                                    <Plus size={12} /> Agregar Extra
                                </button>
                                <div className="space-y-1 max-h-24 overflow-y-auto">
                                    {additionalFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-1">
                                            <input {...register(`additional.${index}.description`)} className="flex-1 text-xs border rounded p-1" placeholder="Item" />
                                            <input type="number" {...register(`additional.${index}.price`)} className="w-12 text-xs border rounded p-1 text-right" placeholder="$" />
                                            <button type="button" onClick={() => removeAdditional(index)}><Trash size={12} className="text-gray-400" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-2 space-y-1">
                                <label className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                    <input type="checkbox" {...register('addCommissionToCustomer')} /> Comisión (+5%)
                                </label>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-blue-600">${calculations.total}</span>
                                </div>
                            </div>

                            {/* Payment Input Compact */}
                            <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <div className="flex justify-between text-xs text-blue-800 mb-1">
                                    <span>Anticipo</span>
                                    <span>Min: ${calculations.minAdvance}</span>
                                </div>
                                <input
                                    type="number"
                                    {...register('advancePayment')}
                                    className="w-full text-lg font-bold text-gray-800 outline-none bg-white p-1 rounded border border-blue-200"
                                />
                                <div className="text-right mt-1 text-xs font-medium">
                                    {calculations.balance === 0 ? <span className="text-green-600">Pagado</span> : <span className="text-red-500">Resta: ${calculations.balance}</span>}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default FolioForm;
