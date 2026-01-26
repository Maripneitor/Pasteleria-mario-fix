import React, { useState, useMemo } from 'react';
import ActionableTable from './ActionableTable';
import AnimatedInput from '../ui/AnimatedInput';
import { Search } from 'lucide-react';

const FolioTable = ({ folios, ...actionHandlers }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFolios = useMemo(() => {
        if (!searchTerm) return folios;
        const lowerTerm = searchTerm.toLowerCase();
        return folios.filter(f =>
            (f.clientName?.toLowerCase().includes(lowerTerm)) ||
            (f.folioNumber?.toString().includes(lowerTerm)) ||
            (f.status?.toLowerCase().includes(lowerTerm))
        );
    }, [folios, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Search className="text-bakery-primary" size={24} />
                        Búsqueda de Pedidos
                    </h3>
                    <div className="w-full md:w-96">
                        <AnimatedInput
                            id="search-table"
                            label="Buscar por cliente o folio..."
                            type="text"
                            placeholder="Ej: Juan Pérez"
                            register={() => ({
                                onChange: (e) => setSearchTerm(e.target.value)
                            })}
                            className="mb-0" // Override margin
                        />
                    </div>
                </div>
            </div>

            <ActionableTable
                data={filteredFolios}
                {...actionHandlers}
            />

            {filteredFolios.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No se encontraron pedidos que coincidan con "{searchTerm}".
                </div>
            )}
        </div>
    );
};

export default React.memo(FolioTable);
