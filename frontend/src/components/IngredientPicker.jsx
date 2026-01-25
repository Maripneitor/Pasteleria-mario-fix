import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import api from '../api/axios';

const IngredientPicker = ({
    type = 'flavor', // 'flavor' or 'filling'
    selected = [],
    onChange,
    disabled = false,
    label = 'Seleccionar'
}) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const endpoint = type === 'flavor' ? '/ingredients/flavors' : '/ingredients/fillings';
                // Mocking response for now if API fails or is empty, to ensure UI works
                // In production this comes from API
                try {
                    const res = await api.get(endpoint);
                    if (res.data && res.data.length > 0) {
                        setOptions(res.data);
                    } else {
                        // Fallback defaults if DB is empty
                        setOptions(type === 'flavor'
                            ? [{ id: 1, name: 'Vainilla' }, { id: 2, name: 'Chocolate' }, { id: 3, name: 'Fresa' }, { id: 4, name: 'Mil Hojas' }, { id: 5, name: 'Pastel de Queso' }]
                            : [{ id: 1, name: 'Fresa' }, { id: 2, name: 'Durazno' }, { id: 3, name: 'Nuez', price: 50 }]
                        );
                    }
                } catch (e) {
                    console.warn(`Could not load ${type}s`, e);
                    setOptions(type === 'flavor'
                        ? [{ id: 1, name: 'Vainilla' }, { id: 2, name: 'Chocolate' }, { id: 3, name: 'Fresa' }, { id: 4, name: 'Mil Hojas' }, { id: 5, name: 'Pastel de Queso' }]
                        : [{ id: 1, name: 'Fresa' }, { id: 2, name: 'Durazno' }, { id: 3, name: 'Nuez', price: 50 }]
                    );
                }
            } finally {
                setLoading(false);
            }
        };
        fetchOptions();
    }, [type]);

    const handleToggle = (option) => {
        if (disabled) return;

        // Check if currently selected (assuming selected is array of objects {id, name} or legacy strings)
        // Hybrid support for legacy strings if needed, but per plan we move to objects.
        const isSelected = selected.some(s => (s.id && s.id === option.id) || s === option.name);

        let newSelected;
        if (isSelected) {
            newSelected = selected.filter(s => (s.id ? s.id !== option.id : s !== option.name));
        } else {
            // Add as object {id, name}
            newSelected = [...selected, { id: option.id, name: option.name }];
        }
        onChange(newSelected);
    };

    if (loading) return <div className="text-xs text-gray-500">Cargando...</div>;

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className={`flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {options.map(opt => {
                    const isSelected = selected.some(s => (s.id && s.id === opt.id) || s === opt.name);
                    return (
                        <button
                            key={opt.id || opt.name}
                            type="button"
                            onClick={() => handleToggle(opt)}
                            className={`
                                text-sm px-3 py-1 rounded-full transition-all border flex items-center gap-1
                                ${isSelected
                                    ? 'bg-blue-100 text-blue-700 border-blue-200 ring-1 ring-blue-300'
                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}
                            `}
                        >
                            {opt.name}
                            {opt.price > 0 && <span className="text-xs ml-1 text-gray-500">(${opt.price})</span>}
                            {isSelected && <X size={12} />}
                        </button>
                    );
                })}
                {options.length === 0 && <span className="text-xs text-gray-400">No hay opciones disponibles</span>}
            </div>
        </div>
    );
};

export default IngredientPicker;
