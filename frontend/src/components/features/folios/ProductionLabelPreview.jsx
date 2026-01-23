import React from 'react';
import { Cake, Users, Clock, AlertTriangle } from 'lucide-react';

const ProductionLabelPreview = ({ formData }) => {
    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha N/A';
        const date = new Date(dateString + 'T12:00:00');
        return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    };

    // Helper to format time
    const formatTime = (timeString) => {
        if (!timeString) return 'Hora N/A';
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    // Validation checks
    const missingFlavor = !formData.cakeFlavor || formData.cakeFlavor.length === 0;
    const missingFilling = !formData.filling || formData.filling.length === 0;
    const isCriticalMissing = missingFlavor || missingFilling;

    return (
        <div className="w-full flex justify-center p-4 print:p-0 print:w-auto">
            <div className={`
                relative bg-bakery-cream
                w-[384px] h-[216px] /* Approx 4x2.25 ratio similar to CSS grid card */
                border-2 border-dashed border-gray-400
                p-3 flex flex-col justify-between
                shadow-md print:shadow-none print:border-gray-800
                ${isCriticalMissing ? 'border-red-400 animate-pulse' : ''}
                bg-[url('/src/assets/noise.svg')] bg-blend-multiply
            `}>

                {/* Critical Missing Alert Overlay */}
                {isCriticalMissing && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-600 px-2 py-0.5 rounded-md border border-red-200 text-xs font-bold flex items-center gap-1 shadow-sm z-10 print:hidden">
                        <AlertTriangle size={12} />
                        DATO FALTANTE
                    </div>
                )}

                {/* Header: Folio Number */}
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-black font-serif leading-none tracking-tight">
                        {formData.id || 'NULO'}
                    </h2>
                </div>

                {/* Body: Delivery Info & Shape */}
                <div className="flex justify-between items-center mt-2 px-2">
                    <div className="flex flex-col items-start">
                        <span className="text-2xl font-bold text-black font-mono">
                            {formatTime(formData.deliveryTime)}
                        </span>
                        <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                            {formatDate(formData.deliveryDate)}
                        </span>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-lg font-bold text-black capitalize">
                                {formData.shape || 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-black font-bold">
                            <Users size={16} />
                            <span className="text-xl">{formData.persons || 0}p</span>
                        </div>
                    </div>
                </div>

                {/* Footer: Flavors & Fillings */}
                <div className="mt-2 border-t border-gray-300 pt-2 space-y-1">
                    <div className={`flex items-start gap-2 ${missingFlavor ? 'bg-red-50' : ''} rounded px-1`}>
                        <span className="text-xs font-bold text-gray-500 uppercase w-12 shrink-0 pt-0.5">Sabor:</span>
                        <span className="text-sm font-bold text-bakery-chocolate leading-tight">
                            {formData.cakeFlavor && formData.cakeFlavor.length > 0
                                ? (Array.isArray(formData.cakeFlavor) ? formData.cakeFlavor.join(', ') : formData.cakeFlavor)
                                : <span className="text-red-400 text-xs italic">-- Requerido --</span>}
                        </span>
                    </div>
                    <div className={`flex items-start gap-2 ${missingFilling ? 'bg-red-50' : ''} rounded px-1`}>
                        <span className="text-xs font-bold text-gray-500 uppercase w-12 shrink-0 pt-0.5">Relleno:</span>
                        <span className="text-sm font-bold text-bakery-chocolate leading-tight">
                            {formData.filling && formData.filling.length > 0
                                ? (Array.isArray(formData.filling) ? formData.filling.map(f => typeof f === 'object' ? f.name : f).join(', ') : formData.filling)
                                : <span className="text-red-400 text-xs italic">-- Requerido --</span>}
                        </span>
                    </div>
                </div>
            </div>

            {/* Print Styles Global Injection (scoped to this component visually) */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .bg-bakery-cream, .bg-bakery-cream * {
                        visibility: visible;
                    }
                    .bg-bakery-cream {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        border: none;
                        margin: 0;
                        padding: 10px;
                         -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductionLabelPreview;
