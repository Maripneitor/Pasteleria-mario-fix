import { Lightbulb, AlertTriangle, Check } from 'lucide-react';
import { useEffect, useState } from 'react';

const AiSidebar = ({ formValues }) => {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const newSuggestions = [];

        // Logic 1: Quantity Suggestion
        if (formValues.persons > 50 && formValues.tiers && formValues.tiers.length < 2 && formValues.folioType === 'Base/Especial') {
            newSuggestions.push({
                type: 'warning',
                text: 'Para más de 50 personas, se recomienda una estructura de al menos 2 pisos.'
            });
        }

        // Logic 2: Flavor Pairing
        if (formValues.cakeFlavor?.includes('Chocolate') && !formValues.filling?.some(f => ['Fresa', 'Nuez'].includes(f))) {
            newSuggestions.push({
                type: 'tip',
                text: 'El pan de Chocolate combina excelente con relleno de Fresa o Nuez.'
            });
        }

        // Logic 3: Payment
        if (formValues.advancePayment > 0 && formValues.advancePayment < (formValues.total * 0.5)) {
            newSuggestions.push({
                type: 'warning',
                text: 'El anticipo es menor al 50% recomendado.'
            });
        }

        setSuggestions(newSuggestions);

    }, [formValues]);

    if (suggestions.length === 0) return (
        <div className="hidden lg:block w-64 bg-blue-50 border-l border-blue-100 p-4">
            <div className="flex items-center gap-2 text-blue-800 font-bold mb-4">
                <Lightbulb size={20} />
                Bandeja IA
            </div>
            <p className="text-sm text-blue-600/70 italic">
                Esperando datos para sugerencias...
            </p>
        </div>
    );

    return (
        <div className="hidden lg:block w-64 bg-blue-50 border-l border-blue-100 p-4 overflow-y-auto">
            <div className="flex items-center gap-2 text-blue-800 font-bold mb-6">
                <Lightbulb size={20} />
                Sugerencias IA
            </div>

            <div className="space-y-4">
                {suggestions.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-3 rounded-lg border text-sm shadow-sm animate-in slide-in-from-right-2 duration-300 ${msg.type === 'warning'
                            ? 'bg-orange-50 border-orange-200 text-orange-800'
                            : 'bg-white border-blue-100 text-blue-800'
                            }`}
                    >
                        <div className="flex gap-2">
                            {msg.type === 'warning' ? <AlertTriangle size={16} className="shrink-0 mt-0.5" /> : <Lightbulb size={16} className="shrink-0 mt-0.5" />}
                            <span>{msg.text}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AiSidebar;
