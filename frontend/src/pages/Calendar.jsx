import React, { useState, useEffect, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Search, Calendar as CalendarIcon, Filter } from 'lucide-react';
import api from '../services/api';
import PDFModalViewer from '../components/PDFModalViewer';

const Calendar = () => {
    const [folios, setFolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // PDF Viewer State
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedFolio, setSelectedFolio] = useState(null);

    // Fetch Folios
    useEffect(() => {
        fetchFolios();
    }, []);

    const fetchFolios = async () => {
        try {
            const response = await api.get('/folios');
            setFolios(response.data);
        } catch (error) {
            console.error("Error fetching folios:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Folios for Search
    const filteredFolios = useMemo(() => {
        if (!searchTerm) return folios;
        const lowerTerm = searchTerm.toLowerCase();
        return folios.filter(f =>
            f.clientName?.toLowerCase().includes(lowerTerm) ||
            f.id.toString().includes(lowerTerm) ||
            f.folioNumber?.toString().includes(lowerTerm)
        );
    }, [folios, searchTerm]);

    // Map to Calendar Events
    const events = useMemo(() => {
        return filteredFolios.map(f => ({
            id: f.id,
            title: `${f.folioNumber ? '#' + f.folioNumber : ''} ${f.clientName}`,
            date: f.deliveryDate, // Ensure format YYYY-MM-DD
            extendedProps: { ...f },
            backgroundColor: f.status === 'Entregado' ? '#10B981' : '#3B82F6',
            borderColor: f.status === 'Entregado' ? '#059669' : '#2563EB',
        }));
    }, [filteredFolios]);

    // Handle Event Click
    const handleEventClick = (info) => {
        setSelectedFolio(info.event.extendedProps);
        setViewerOpen(true);
    };

    // --- Navigation Logic ---
    const getFoliosForDay = (dateStr) => {
        // Filter original list (not search filtered) to allow navigation even if search is active? 
        // Typically navigation happens within the context of what's visible, but for "Next in Day" it usually implies all tasks that day.
        // Let's use PRE-FILTERED list (all folios) ensuring reliable next/prev logic for the day regardless of search.
        return folios.filter(f => f.deliveryDate === dateStr).sort((a, b) => a.id - b.id);
    };

    const handleNext = () => {
        if (!selectedFolio) return;
        const dayFolios = getFoliosForDay(selectedFolio.deliveryDate);
        const currentIndex = dayFolios.findIndex(f => f.id === selectedFolio.id);
        if (currentIndex < dayFolios.length - 1) {
            setSelectedFolio(dayFolios[currentIndex + 1]);
        }
    };

    const handlePrev = () => {
        if (!selectedFolio) return;
        const dayFolios = getFoliosForDay(selectedFolio.deliveryDate);
        const currentIndex = dayFolios.findIndex(f => f.id === selectedFolio.id);
        if (currentIndex > 0) {
            setSelectedFolio(dayFolios[currentIndex - 1]);
        }
    };

    // Check Navigation Availability
    const { hasNext, hasPrev } = useMemo(() => {
        if (!selectedFolio) return { hasNext: false, hasPrev: false };
        const dayFolios = getFoliosForDay(selectedFolio.deliveryDate);
        const currentIndex = dayFolios.findIndex(f => f.id === selectedFolio.id);
        return {
            hasPrev: currentIndex > 0,
            hasNext: currentIndex !== -1 && currentIndex < dayFolios.length - 1
        };
    }, [selectedFolio, folios]);

    return (
        <div className="h-full flex flex-col bg-gray-50 p-6 space-y-6 overflow-hidden">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 text-red-600">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <CalendarIcon size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Calendario de Entregas</h1>
                </div>

                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                        placeholder="Buscar por cliente o folio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Calendar Container */}
            <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 p-6 overflow-hidden flex flex-col">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale={esLocale}
                    events={events} // Use filtered events
                    eventClick={handleEventClick}
                    height="100%"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek'
                    }}
                    dayMaxEvents={3} // Show "+X more" if too many
                    eventClassNames="cursor-pointer hover:opacity-90 transition-opacity font-medium shadow-sm border-0"
                    eventContent={(arg) => (
                        <div className="flex items-center gap-1 overflow-hidden px-1 py-0.5">
                            <span className="text-xs font-bold truncate">{arg.event.title}</span>
                        </div>
                    )}
                />
            </div>

            {/* PDF Viewer Modal */}
            <PDFModalViewer
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
                folio={selectedFolio}
                onNext={handleNext}
                onPrev={handlePrev}
                hasNext={hasNext}
                hasPrev={hasPrev}
            />
        </div>
    );
};

export default Calendar;
